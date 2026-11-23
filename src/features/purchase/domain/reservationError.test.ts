import { describe, expect, it } from 'vitest'
import { ApiError, CLIENT_ERROR_CODE } from '@/shared/lib/http/ApiError'
import { toReservationError } from './reservationError'

function apiError(error: string, status: number) {
  return new ApiError({ error, message: error, status })
}

describe('toReservationError', () => {
  it.each([
    ['seat_unavailable', 409, 'SEATS_TAKEN'],
    ['sector_sold_out', 409, 'SEATS_TAKEN'],
    ['ticket_limit_exceeded', 409, 'LIMIT'],
    ['unauthorized', 401, 'UNAUTHORIZED'],
    ['service_unavailable', 503, 'FAILED'],
    ['data_conflict', 409, 'FAILED'],
    ['event_not_on_sale', 409, 'FAILED'],
    [CLIENT_ERROR_CODE.NETWORK, 0, 'FAILED'],
  ] as const)('%s (%i) es %s', (code, status, expected) => {
    expect(toReservationError(apiError(code, status))).toBe(expected)
  })

  it('un error que no viene del apiClient es una falla', () => {
    expect(toReservationError(new Error('boom'))).toBe('FAILED')
  })
})
