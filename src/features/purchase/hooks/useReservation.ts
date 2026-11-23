import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/routes'
import { createReservation } from '../services/reservations.service'
import type { ReservationDraft } from '../types/purchase.types'
import { useIdempotencyKey } from './useIdempotencyKey'

/** Reserva lo elegido y, cuando la orden se crea, lleva a Pago con su `orderId`. */
export function useReservation(draft: ReservationDraft | undefined) {
  const navigate = useNavigate()
  const idempotencyKey = useIdempotencyKey(draft)
  const mutation = useMutation({
    mutationFn: createReservation,
    onSuccess: (order) => navigate(ROUTES.orderPayment(order.eventId, order.id)),
  })

  const reserve = () => {
    if (!draft || mutation.isPending) return
    mutation.mutate({ ...draft, idempotencyKey })
  }

  return { reserve, isReserving: mutation.isPending }
}
