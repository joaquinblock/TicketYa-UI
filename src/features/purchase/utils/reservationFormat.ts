import type { EventDetail } from '@/shared/types/event.types'
import type { ReservationError, ShownReservationError } from '../types/purchase.types'

const RESERVATION_ERROR_MESSAGE = {
  UNAUTHORIZED: 'Iniciá sesión para reservar tus lugares.',
  FAILED: 'No pudimos reservar tus lugares.',
} as const satisfies Record<Exclude<ReservationError, 'SEATS_TAKEN' | 'LIMIT'>, string>

/** El 409 del límite no dice cuál es: sale del evento. Sin límite no puede llegar, y cae en la falla. */
export function formatReservationError(
  error: ShownReservationError,
  maxTicketsPerCustomer: EventDetail['maxTicketsPerCustomer'],
) {
  if (error === 'LIMIT') {
    return maxTicketsPerCustomer === null
      ? RESERVATION_ERROR_MESSAGE.FAILED
      : `Podés tener hasta ${maxTicketsPerCustomer} entradas para este evento, contando las que ya compraste.`
  }
  return RESERVATION_ERROR_MESSAGE[error]
}
