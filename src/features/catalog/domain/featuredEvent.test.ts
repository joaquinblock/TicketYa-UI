import { describe, expect, it } from 'vitest'
import type { EventSummary } from '../types/catalog.types'
import { formatFeaturedCountdown, pickFeaturedEvent } from './featuredEvent'

function makeEvent(overrides: Partial<EventSummary> = {}): EventSummary {
  return {
    id: 1,
    name: 'Evento prueba',
    type: 'CONCERT',
    status: 'PUBLISHED',
    dateTime: '2026-12-26T21:00:00',
    highDemand: false,
    saleStart: null,
    venue: {
      name: 'Estadio del Sur',
      city: 'Buenos Aires',
    },
    priceFrom: 25000,
    photoUrl: null,
    participants: [],
    ...overrides,
  }
}

describe('pickFeaturedEvent', () => {
  const nowMs = Date.parse('2026-12-01T12:00:00')

  it('prioriza un evento publicado de alta demanda con saleStart futuro', () => {
    const regular = makeEvent({ id: 1, name: 'Regular' })
    const upcomingHot = makeEvent({
      id: 2,
      name: 'Lanzamiento',
      highDemand: true,
      saleStart: '2026-12-02T12:00:00',
    })

    expect(pickFeaturedEvent([regular, upcomingHot], nowMs)?.id).toBe(2)
  })

  it('si no hay venta futura, elige alta demanda publicado o el primero publicado', () => {
    const soldOut = makeEvent({ id: 1, status: 'SOLD_OUT', highDemand: true })
    const regular = makeEvent({ id: 2, name: 'Publicado' })

    expect(pickFeaturedEvent([soldOut, regular], nowMs)?.id).toBe(2)
  })
})

describe('formatFeaturedCountdown', () => {
  const nowMs = Date.parse('2026-12-01T12:00:00')

  it('formatea horas, minutos y segundos hasta saleStart', () => {
    expect(formatFeaturedCountdown('2026-12-01T14:05:09', nowMs)).toEqual({
      hh: '02',
      mm: '05',
      ss: '09',
    })
  })

  it('devuelve null si saleStart ya pasó o es null', () => {
    expect(formatFeaturedCountdown('2026-12-01T11:59:59', nowMs)).toBeNull()
    expect(formatFeaturedCountdown(null, nowMs)).toBeNull()
  })
})
