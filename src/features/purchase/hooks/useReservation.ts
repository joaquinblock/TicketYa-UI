import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/routes'
import { toReservationError } from '../domain/reservationError'
import { createReservation } from '../services/reservations.service'
import type { ReservationDraft } from '../types/purchase.types'
import { useIdempotencyKey } from './useIdempotencyKey'

type UseReservationVariables = {
  draft: ReservationDraft | undefined
  /** Otra persona ganó un lugar: hay que volver a pedir la disponibilidad para que se vea. */
  onSeatsTaken: () => void
}

/** Reserva lo elegido y, cuando la orden se crea, lleva a Pago con su `orderId`. */
export function useReservation({ draft, onSeatsTaken }: UseReservationVariables) {
  const navigate = useNavigate()
  const idempotencyKey = useIdempotencyKey(draft)
  const mutation = useMutation({
    mutationFn: createReservation,
    onSuccess: (order) => navigate(ROUTES.orderPayment(order.eventId, order.id)),
    onError: (error) => {
      if (toReservationError(error) === 'SEATS_TAKEN') onSeatsTaken()
    },
  })

  const reserve = () => {
    if (!draft || mutation.isPending) return
    mutation.mutate({ ...draft, idempotencyKey })
  }

  return { reserve, isReserving: mutation.isPending }
}
