import { describe, expect, it } from 'vitest'
import type { SeatAvailability, SectorAvailability } from '@/shared/types/event.types'
import { summarizeSelection } from './selectionSummary'

const PLATEA_PRICE = 45000

function seat(seatId: number, row: string, number: number): SeatAvailability {
  return { seatId, row, number, available: true }
}

const plateaBaja: SectorAvailability = {
  eventSectorId: 1,
  sectorName: 'Platea baja',
  price: PLATEA_PRICE,
  numbered: true,
  availablePlaces: 4,
  seats: [seat(10, 'F', 7), seat(11, 'F', 8), seat(20, 'G', 2), seat(21, 'G', 3)],
}

describe('summarizeSelection', () => {
  it('con 2 asientos, una línea por asiento con el precio del sector y el total', () => {
    expect(summarizeSelection({ sector: plateaBaja, selection: [10, 11], quantity: 0 })).toEqual({
      lines: [
        { key: 10, label: 'Platea baja · fila F, asiento 7', price: PLATEA_PRICE },
        { key: 11, label: 'Platea baja · fila F, asiento 8', price: PLATEA_PRICE },
      ],
      total: 2 * PLATEA_PRICE,
      count: 2,
    })
  })
})
