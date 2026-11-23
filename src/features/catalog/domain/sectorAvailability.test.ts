import { describe, expect, it } from 'vitest'
import type { EventDetail, EventSector, SectorAvailability } from '../types/catalog.types'
import {
  getPurchaseAction,
  isAvailabilityVisible,
  isPurchaseOpen,
  joinSectorsWithAvailability,
} from './sectorAvailability'

const detailSector = (sectorId: number, name: string): EventSector => ({
  sectorId,
  name,
  numbered: false,
  capacity: 100,
  price: 1000,
})

const availabilityOf = (
  eventSectorId: number,
  sectorName: string,
  availablePlaces: number,
): SectorAvailability => ({
  eventSectorId,
  sectorName,
  price: 1000,
  numbered: false,
  availablePlaces,
  seats: null,
})

describe('joinSectorsWithAvailability: unión por nombre', () => {
  it('cada sector toma la disponibilidad de su mismo nombre y queda en el orden del detalle', () => {
    const sectors = [
      detailSector(1, 'Campo'),
      detailSector(2, 'Platea'),
      detailSector(3, 'Pullman'),
    ]
    const availability = [
      availabilityOf(30, 'Pullman', 7),
      availabilityOf(10, 'Campo', 50),
      availabilityOf(20, 'Platea', 0),
    ]

    const joined = joinSectorsWithAvailability(sectors, availability)

    expect(joined.map(({ name, availability }) => [name, availability?.availablePlaces])).toEqual([
      ['Campo', 50],
      ['Platea', 0],
      ['Pullman', 7],
    ])
  })

  it('un sector del detalle sin par en la disponibilidad queda con nombre y precio, sin lugares', () => {
    const joined = joinSectorsWithAvailability(
      [detailSector(1, 'Campo'), detailSector(2, 'Palco')],
      [availabilityOf(10, 'Campo', 50)],
    )

    expect(joined[1]).toEqual({ ...detailSector(2, 'Palco'), availability: undefined })
  })
})

type SaleState = Pick<EventDetail, 'status' | 'saleStart'>

/** Hora local, sin zona, como las fechas que manda el backend. */
const NOW = new Date('2026-11-22T12:00:00')
const PAST_SALE_START = '2026-11-20T10:00:00'
const FUTURE_SALE_START = '2026-12-01T10:00:00'

describe('isAvailabilityVisible e isPurchaseOpen', () => {
  it.each<[string, SaleState]>([
    ['sin fecha de apertura', { status: 'PUBLISHED', saleStart: null }],
    ['con la apertura ya pasada', { status: 'PUBLISHED', saleStart: PAST_SALE_START }],
  ])('a la venta %s muestra la disponibilidad y el botón', (_, event) => {
    expect(isAvailabilityVisible(event, NOW)).toBe(true)
    expect(isPurchaseOpen(event, NOW)).toBe(true)
  })

  it('agotado muestra la disponibilidad, sin botón', () => {
    const event: SaleState = { status: 'SOLD_OUT', saleStart: PAST_SALE_START }
    expect(isAvailabilityVisible(event, NOW)).toBe(true)
    expect(isPurchaseOpen(event, NOW)).toBe(false)
  })

  it.each<[string, SaleState]>([
    ['con la venta futura', { status: 'PUBLISHED', saleStart: FUTURE_SALE_START }],
    ['suspendido', { status: 'SUSPENDED', saleStart: PAST_SALE_START }],
    ['cancelado', { status: 'CANCELLED', saleStart: PAST_SALE_START }],
    ['finalizado', { status: 'FINISHED', saleStart: PAST_SALE_START }],
  ])('%s no muestra ni la disponibilidad ni el botón', (_, event) => {
    expect(isAvailabilityVisible(event, NOW)).toBe(false)
    expect(isPurchaseOpen(event, NOW)).toBe(false)
  })
})

describe('getPurchaseAction', () => {
  it('con alta demanda es "Entrar a la fila" y lleva a la fila del evento', () => {
    expect(getPurchaseAction({ id: 1, highDemand: true })).toEqual({
      label: 'Entrar a la fila',
      to: '/eventos/1/fila',
    })
  })

  it('sin alta demanda es "Elegir lugares" y lleva a Lugares del evento', () => {
    expect(getPurchaseAction({ id: 2, highDemand: false })).toEqual({
      label: 'Elegir lugares',
      to: '/eventos/2/lugares',
    })
  })
})
