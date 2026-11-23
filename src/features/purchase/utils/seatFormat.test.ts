import { describe, expect, it } from 'vitest'
import {
  formatSeatAccessibleName,
  formatSectorTabLabel,
  formatTakenSeatsMessage,
  formatUnnumberedPlaces,
  formatQuantityLoweredMessage,
  formatSectorSoldOutMessage,
} from './seatFormat'

describe('formatSectorTabLabel', () => {
  it('con lugares muestra el precio con formato', () => {
    expect(formatSectorTabLabel({ price: 20000, availablePlaces: 12 })).toBe('$20.000')
  })

  it('con 0 lugares muestra "Agotado"', () => {
    expect(formatSectorTabLabel({ price: 20000, availablePlaces: 0 })).toBe('Agotado')
  })
})

describe('formatTakenSeatsMessage', () => {
  const seatF = (number: number) => ({ row: 'F', number })

  it('con uno, nombra el asiento en singular', () => {
    expect(formatTakenSeatsMessage([seatF(7)])).toEqual({
      lead: 'El asiento F7 lo acaba de reservar otra persona.',
      hint: 'Lo sacamos de tu elección: elegí otro.',
    })
  })

  it('con dos, los nombra en plural unidos con "y"', () => {
    expect(formatTakenSeatsMessage([seatF(7), seatF(8)])).toEqual({
      lead: 'Los asientos F7 y F8 los acaba de reservar otra persona.',
      hint: 'Los sacamos de tu elección: elegí otros.',
    })
  })

  it('con tres, los separa con comas y une el último con "y"', () => {
    expect(formatTakenSeatsMessage([seatF(7), seatF(8), seatF(9)]).lead).toBe(
      'Los asientos F7, F8 y F9 los acaba de reservar otra persona.',
    )
  })
})

describe('formatSeatAccessibleName', () => {
  it.each([
    ['AVAILABLE', 'Fila A, asiento 3, disponible'],
    ['TAKEN', 'Fila A, asiento 3, ocupado'],
    ['SELECTED', 'Fila A, asiento 3, elegido'],
  ] as const)('un asiento %s se llama "%s"', (status, name) => {
    expect(formatSeatAccessibleName({ row: 'A', number: 3 }, status)).toBe(name)
  })
})

describe('formatUnnumberedPlaces', () => {
  it('muestra los libres y la capacidad con separador de miles', () => {
    expect(formatUnnumberedPlaces({ availablePlaces: 1240, capacity: 5000 })).toBe(
      'Sin numerar · 1.240 lugares libres de 5.000',
    )
  })
})

describe('formatQuantityLoweredMessage', () => {
  it('con 2 lugares, avisa en plural a cuánto bajó la cantidad', () => {
    expect(formatQuantityLoweredMessage({ sectorName: 'Campo', quantity: 2 })).toEqual({
      lead: 'Quedan 2 lugares en Campo:',
      hint: 'bajamos tu cantidad a 2',
    })
  })

  it('con 1 lugar, avisa en singular', () => {
    expect(formatQuantityLoweredMessage({ sectorName: 'Campo', quantity: 1 })).toEqual({
      lead: 'Queda 1 lugar en Campo:',
      hint: 'bajamos tu cantidad a 1',
    })
  })
})

describe('formatSectorSoldOutMessage', () => {
  it('nombra el sector agotado y pide elegir otro', () => {
    expect(formatSectorSoldOutMessage('Campo')).toEqual({
      lead: 'Se agotó Campo.',
      hint: 'Elegí otro sector.',
    })
  })
})
