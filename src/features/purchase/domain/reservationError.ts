import { ApiError } from '@/shared/lib/http/ApiError'
import type { ReservationError } from '../types/purchase.types'

const HTTP_UNAUTHORIZED = 401

const RESERVATION_ERROR_BY_CODE: Partial<Record<string, ReservationError>> = {
  seat_unavailable: 'SEATS_TAKEN',
  sector_sold_out: 'SEATS_TAKEN',
  ticket_limit_exceeded: 'LIMIT',
}

/**
 * Qué le pasó a la reserva, según el error del backend. Lo que la story no nombra (la red, un 503,
 * `event_not_on_sale`, `data_conflict`) es una falla: se puede reintentar.
 */
export function toReservationError(error: unknown): ReservationError {
  if (!(error instanceof ApiError)) return 'FAILED'
  if (error.status === HTTP_UNAUTHORIZED) return 'UNAUTHORIZED'
  return RESERVATION_ERROR_BY_CODE[error.code] ?? 'FAILED'
}
