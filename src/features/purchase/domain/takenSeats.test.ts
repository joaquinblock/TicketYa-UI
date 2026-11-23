import { describe, expect, it } from 'vitest'
import type { SeatAvailability } from '@/shared/types/event.types'
import { splitTakenSeats } from './takenSeats'

const seat = (seatId: number, available: boolean): SeatAvailability => ({
  seatId,
  row: 'F',
  number: seatId,
  available,
})

describe('splitTakenSeats', () => {
  it('si nada se ocupó, conserva toda la selección y no reporta ninguno', () => {
    const selected = [seat(7, true), seat(8, true)]
    const current = [seat(7, true), seat(8, true), seat(9, false)]

    expect(splitTakenSeats(selected, current)).toEqual({ kept: [7, 8], taken: [] })
  })

  it('si se ocupó uno, sale de la selección y se reporta', () => {
    const selected = [seat(7, true), seat(8, true)]
    const current = [seat(7, false), seat(8, true)]

    expect(splitTakenSeats(selected, current)).toEqual({ kept: [8], taken: [seat(7, true)] })
  })

  it('si un asiento elegido ya no viene en la respuesta, se reporta como ocupado', () => {
    const selected = [seat(7, true), seat(8, true)]
    const current = [seat(8, true)]

    expect(splitTakenSeats(selected, current)).toEqual({ kept: [8], taken: [seat(7, true)] })
  })
})
