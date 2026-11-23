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

describe('summarizeSelection, orden de las líneas', () => {
  it('con filas distintas elegidas en otro orden, las líneas van por fila y número', () => {
    const shuffled = {
      ...plateaBaja,
      seats: [seat(21, 'G', 3), seat(11, 'F', 8), seat(10, 'F', 7)],
    }

    const { lines } = summarizeSelection({ sector: shuffled, selection: [21, 11, 10], quantity: 0 })

    expect(lines.map((line) => line.key)).toEqual([10, 11, 21])
  })
})

describe('summarizeSelection, sector no numerado', () => {
  const CAMPO_PRICE = 30000
  const campo: SectorAvailability = {
    eventSectorId: 2,
    sectorName: 'Campo',
    price: CAMPO_PRICE,
    numbered: false,
    availablePlaces: 1240,
    seats: null,
  }

  it('con cantidad 2, una sola línea "2 × Campo" con el precio por la cantidad', () => {
    expect(summarizeSelection({ sector: campo, selection: [], quantity: 2 })).toEqual({
      lines: [{ key: 2, label: '2 × Campo', price: 2 * CAMPO_PRICE }],
      total: 2 * CAMPO_PRICE,
      count: 2,
    })
  })

  it('con cantidad 0 (el sector se agotó), no hay líneas y el total es 0', () => {
    expect(summarizeSelection({ sector: campo, selection: [], quantity: 0 })).toEqual({
      lines: [],
      total: 0,
      count: 0,
    })
  })
})

describe('summarizeSelection, nada elegido', () => {
  it('sin asientos elegidos, no hay líneas y el total es 0', () => {
    expect(summarizeSelection({ sector: plateaBaja, selection: [], quantity: 0 })).toEqual({
      lines: [],
      total: 0,
      count: 0,
    })
  })

  it('sin sector abierto (todavía cargando), no hay líneas y el total es 0', () => {
    expect(summarizeSelection({ sector: undefined, selection: [], quantity: 0 })).toEqual({
      lines: [],
      total: 0,
      count: 0,
    })
  })
})
