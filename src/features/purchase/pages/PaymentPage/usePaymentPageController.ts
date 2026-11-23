import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { getEvent } from '@/shared/services/events.service'
import { MAX_PAYMENT_ATTEMPTS } from '../../constants/payment.constants'
import { useCancelOrder } from '../../hooks/useCancelOrder'
import { useCountdown } from '../../hooks/useCountdown'
import { usePayOrder } from '../../hooks/usePayOrder'
import { usePendingOrder } from '../../hooks/usePendingOrder'
import type { Order, PaymentEndReason, PaymentMethod } from '../../types/payment.types'
import { classifyPayError, getCancelErrorMessage } from '../../utils/paymentErrors'

type RejectionFeedback = { reason: string; attempts: number }

function resolveOrderEndReason(order: Order | null | undefined): PaymentEndReason | undefined {
  if (!order) return undefined
  if (order.status === 'EXPIRED') return 'EXPIRED'
  if (order.status === 'REJECTED') return 'REJECTED'
  if (order.status === 'CANCELLED') return 'ABANDONED'
  return undefined
}

export function usePaymentPageController(eventId: number | undefined, orderId: number | undefined) {
  const orderQuery = usePendingOrder(eventId, orderId)
  const eventQuery = useQuery({
    queryKey: ['event-photo', eventId],
    enabled: eventId != null,
    queryFn: () => getEvent(eventId!),
    staleTime: 60_000,
  })
  const [paidOrder, setPaidOrder] = useState<Order | null>(null)
  const [endReason, setEndReason] = useState<PaymentEndReason | undefined>(undefined)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('CREDIT_CARD')
  const [rejection, setRejection] = useState<RejectionFeedback | null>(null)
  const [noAnswer, setNoAnswer] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  // Clave idempotente del intento actual: se conserva si hay 503/red y se renueva tras un rechazo.
  const attemptKeyRef = useRef<string>(crypto.randomUUID())

  const payMutation = usePayOrder()
  const cancelMutation = useCancelOrder()

  const order = paidOrder ?? orderQuery.data
  const derivedEnd = endReason ?? resolveOrderEndReason(order)
  const isPaid = paidOrder != null || order?.status === 'PAID'
  const isActive = order != null && order.status === 'PENDING' && !isPaid && !derivedEnd

  const secondsLeft = useCountdown(order?.expiresAt, isActive)
  const effectiveEnd: PaymentEndReason | undefined =
    derivedEnd ?? (isActive && order && secondsLeft <= 0 ? 'EXPIRED' : undefined)

  const handlePay = () => {
    if (!order || !isActive || payMutation.isPending || cancelMutation.isPending) return
    setActionError(null)
    payMutation.mutate(
      {
        orderId: order.id,
        payload: { paymentMethod: selectedMethod, idempotencyKey: attemptKeyRef.current },
      },
      {
        onSuccess: (updated) => {
          setNoAnswer(false)
          setRejection(null)
          setPaidOrder(updated)
        },
        onError: (error) => {
          const outcome = classifyPayError(error)
          if (outcome.kind === 'no_answer') {
            setNoAnswer(true)
            return
          }
          // Cualquier resultado definitivo (422/409) cierra ese intento: el próximo usa clave nueva.
          setNoAnswer(false)
          attemptKeyRef.current = crypto.randomUUID()
          if (outcome.kind === 'rejected') {
            if (outcome.rejectedAttempts >= MAX_PAYMENT_ATTEMPTS) {
              setEndReason('REJECTED')
            } else {
              setRejection({ reason: outcome.reason, attempts: outcome.rejectedAttempts })
            }
            return
          }
          if (outcome.kind === 'ended') {
            setEndReason(outcome.endReason)
            return
          }
          setActionError(outcome.message)
        },
      },
    )
  }

  const handleAbandon = () => {
    if (!order || !isActive || payMutation.isPending || cancelMutation.isPending) return
    setActionError(null)
    cancelMutation.mutate(order.id, {
      onSuccess: () => setEndReason('ABANDONED'),
      onError: (error) => setActionError(getCancelErrorMessage(error)),
    })
  }

  return {
    order,
    photoUrl: eventQuery.data?.photoUrl,
    isLoading: orderQuery.isPending,
    isLoadError: orderQuery.isError,
    loadError: orderQuery.error,
    retryLoad: () => void orderQuery.refetch(),
    isPaid,
    endReason: effectiveEnd,
    secondsLeft,
    selectedMethod,
    setSelectedMethod,
    rejection,
    noAnswer,
    actionError,
    isPaying: payMutation.isPending,
    isCancelling: cancelMutation.isPending,
    handlePay,
    handleAbandon,
  }
}
