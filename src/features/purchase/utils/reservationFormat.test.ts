import { describe, expect, it } from 'vitest'
import { formatReservationError } from './reservationFormat'

describe('formatReservationError', () => {
  it('con el límite superado, dice cuántas entradas se pueden tener en el evento', () => {
    expect(formatReservationError('LIMIT', 4)).toBe(
      'Podés tener hasta 4 entradas para este evento, contando las que ya compraste.',
    )
  })

  it('sin sesión, pide iniciarla', () => {
    expect(formatReservationError('UNAUTHORIZED', 4)).toBe(
      'Iniciá sesión para reservar tus lugares.',
    )
  })

  it('con una falla del servidor o la red, dice que no se pudo reservar', () => {
    expect(formatReservationError('FAILED', null)).toBe('No pudimos reservar tus lugares.')
  })
})
