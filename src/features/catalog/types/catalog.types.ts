import type { EVENT_SORTS, EVENT_TYPES } from '../constants/catalog.constants'

export type EventType = (typeof EVENT_TYPES)[number]
export type EventSort = (typeof EVENT_SORTS)[number]
/** Los estados de un evento visible: el borrador no se muestra. */
export type EventStatus = 'PUBLISHED' | 'SOLD_OUT' | 'SUSPENDED' | 'CANCELLED' | 'FINISHED'
/** La cartelera solo muestra eventos publicados o agotados. */
export type BoardEventStatus = Extract<EventStatus, 'PUBLISHED' | 'SOLD_OUT'>

export type EventTypeLabel = { plural: string; singular: string }

export type Venue = {
  id: number
  name: string
  address: string
  city: string
}

/** Evento como lo devuelve `GET /api/events`. */
export type EventSummary = {
  id: number
  name: string
  type: EventType
  status: BoardEventStatus
  /** Fecha y hora local del evento, sin zona (`2026-12-02T22:00:00`). */
  dateTime: string
  highDemand: boolean
  venue: Pick<Venue, 'name' | 'city'>
  priceFrom: number
  participants: string[]
}

export type Participant = {
  id: number
  name: string
  type: 'ARTIST' | 'TEAM' | 'SPEAKER'
}

export type EventSector = {
  sectorId: number
  name: string
  numbered: boolean
  capacity: number
  price: number
}

/** Evento como lo devuelve `GET /api/events/{id}`. */
export type EventDetail = Pick<EventSummary, 'id' | 'name' | 'type' | 'dateTime' | 'highDemand'> & {
  description: string | null
  status: EventStatus
  venue: Venue & { latitude: number; longitude: number }
  /** Apertura de la venta, en hora local sin zona como `dateTime`. Sin fecha, la venta ya está abierta. */
  saleStart: string | null
  maxTicketsPerCustomer: number
  sectors: EventSector[]
  participants: Participant[]
}

export type Page<T> = {
  content: T[]
  /** Desde 0, como lo cuenta el backend. */
  page: number
  size: number
  totalElements: number
  totalPages: number
}

/** Filtros de la cartelera tal como viven en la URL. `page` empieza en 1. */
export type EventFilters = {
  q?: string
  type?: EventType
  city?: string
  from?: string
  to?: string
  sort: EventSort
  page: number
}
