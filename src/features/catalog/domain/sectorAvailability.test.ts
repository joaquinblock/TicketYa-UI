import { describe, expect, it } from 'vitest'
import type { EventDetail } from '@/shared/types/event.types'
import { getPurchaseAction, isAvailabilityVisible, isPurchaseOpen } from './sectorAvailability'

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
