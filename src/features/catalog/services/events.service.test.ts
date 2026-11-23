import { describe, expect, it } from 'vitest'
import { EVENTS_PAGE_SIZE } from '../constants/catalog.constants'
import type { EventSummary } from '../types/catalog.types'
import { searchEvents } from './events.service'
import { getEvent } from './events.service'
import { ApiError } from '@/shared/lib/http/ApiError'

/** Las reglas valen con cualquier dato del seeder; solo el agotado es un ancla de "Datos de prueba". */
const SOLD_OUT_ANCHOR = 'Jazz en el puerto'

const dateTimes = (events: EventSummary[]) => events.map((event) => event.dateTime)
const ids = (events: EventSummary[]) => events.map((event) => event.id)

describe('searchEvents', () => {
  it('sin filtros trae una página de eventos ordenados por fecha, cada uno con lugar, ciudad y precio', async () => {
    const result = await searchEvents({ sort: 'DATE', page: 1 }, EVENTS_PAGE_SIZE)

    expect(result.content.length).toBeGreaterThan(0)
    expect(result.content.length).toBeLessThanOrEqual(EVENTS_PAGE_SIZE)
    expect(dateTimes(result.content)).toEqual([...dateTimes(result.content)].sort())
    for (const event of result.content) {
      expect(event.venue.name).not.toBe('')
      expect(event.venue.city).not.toBe('')
      expect(event.priceFrom).toBeGreaterThan(0)
    }
  })

  it('trae el agotado del seeder con su lugar, ciudad y precio desde', async () => {
    const result = await searchEvents(
      { q: SOLD_OUT_ANCHOR, sort: 'DATE', page: 1 },
      EVENTS_PAGE_SIZE,
    )

    expect(result.content.find((event) => event.name === SOLD_OUT_ANCHOR)).toMatchObject({
      venue: { name: 'Sala del Puerto', city: 'Mar del Plata' },
      priceFrom: 18000,
      status: 'SOLD_OUT',
    })
  })

  it('la página 2 de la URL pide la segunda página del backend', async () => {
    const first = await searchEvents({ sort: 'DATE', page: 1 }, EVENTS_PAGE_SIZE)
    const second = await searchEvents({ sort: 'DATE', page: 2 }, EVENTS_PAGE_SIZE)

    expect(first.totalPages).toBeGreaterThan(1)
    expect(second.page).toBe(1)
    expect(second.content.length).toBeGreaterThan(0)
    expect(ids(second.content).filter((id) => ids(first.content).includes(id))).toEqual([])
  })
})

describe('searchEvents con filtros', () => {
  it('con el tipo recital trae solo recitales', async () => {
    const result = await searchEvents({ type: 'CONCERT', sort: 'DATE', page: 1 }, EVENTS_PAGE_SIZE)

    expect(result.content.length).toBeGreaterThan(0)
    expect(result.content.every((event) => event.type === 'CONCERT')).toBe(true)
  })

  it('con la ciudad en minúscula trae solo eventos de esa ciudad', async () => {
    const result = await searchEvents({ city: 'tandil', sort: 'DATE', page: 1 }, EVENTS_PAGE_SIZE)

    expect(result.content.length).toBeGreaterThan(0)
    expect(result.content.every((event) => event.venue.city === 'Tandil')).toBe(true)
  })
})

/** Ancla de "Datos de prueba": el evento 1 es de alta demanda, a la venta y con participantes. */
const HIGH_DEMAND_EVENT_ID = 1
const MISSING_EVENT_ID = 999999

describe('getEvent', () => {
  it('trae el evento con su lugar, sus participantes y su estado', async () => {
    const event = await getEvent(HIGH_DEMAND_EVENT_ID)

    expect(event).toMatchObject({ id: HIGH_DEMAND_EVENT_ID, status: 'PUBLISHED', highDemand: true })
    expect(event.venue.address).not.toBe('')
    expect(event.venue.city).not.toBe('')
    expect(typeof event.venue.latitude).toBe('number')
    expect(typeof event.venue.longitude).toBe('number')
    expect(event.participants.length).toBeGreaterThan(0)
    for (const participant of event.participants) expect(participant.name).not.toBe('')
  })

  it('con un id que no existe falla con event_not_found y 404', async () => {
    const error = await getEvent(MISSING_EVENT_ID).catch((caught: unknown) => caught)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ code: 'event_not_found', status: 404 })
  })
})
