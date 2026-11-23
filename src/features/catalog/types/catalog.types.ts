import type { EVENT_SORTS, EVENT_TYPES } from '../constants/catalog.constants'

export type EventType = (typeof EVENT_TYPES)[number]
export type EventSort = (typeof EVENT_SORTS)[number]
/** Los estados de un evento visible: el borrador no se muestra. */
export type EventStatus = 'PUBLISHED' | 'SOLD_OUT' | 'SUSPENDED' | 'CANCELLED' | 'FINISHED'
/** Los estados en que no se venden entradas: cada uno lleva su badge en el detalle. */
export type OffSaleStatus = Exclude<EventStatus, 'PUBLISHED'>
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
  /** Apertura de la venta, en hora local sin zona como `dateTime`. Sin fecha, la venta ya está abierta. */
  saleStart: string | null
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

export type SeatAvailability = {
  seatId: number
  row: string
  number: number
  available: boolean
}

/**
 * Sector como lo devuelve `GET /api/availability`. Su id no es el `sectorId` del detalle: se une
 * con él por nombre, que es único dentro del lugar. Un sector no numerado no trae asientos.
 */
export type SectorAvailability = {
  eventSectorId: number
  sectorName: string
  price: number
  numbered: boolean
  availablePlaces: number
  seats: SeatAvailability[] | null
}

export type EventAvailability = { eventId: number; sectors: SectorAvailability[] }

/** Un sector del detalle con su disponibilidad, si la hay. */
export type SectorWithAvailability = EventSector & { availability?: SectorAvailability }

export type PurchaseAction = { label: string; to: string }

/** Badges de la card: el de la venta (agotado o próximamente) y el de alta demanda. */
export type EventFlagKind = 'SOLD_OUT' | 'SALE_NOT_STARTED' | 'HIGH_DEMAND'
export type EventFlag = { kind: EventFlagKind; isHighlighted: boolean }

export type EventNoticeKind =
  'HIGH_DEMAND' | 'SALE_NOT_STARTED' | 'SOLD_OUT' | 'SUSPENDED' | 'CANCELLED' | 'FINISHED'
/** El de venta no empezada lleva la fecha de apertura: su texto se arma, no es fijo. */
export type FixedNoticeKind = Exclude<EventNoticeKind, 'SALE_NOT_STARTED'>
export type EventNoticeText = { title: string; message: string }
export type EventNotice = EventNoticeText & { kind: EventNoticeKind }

/** Evento como lo devuelve `GET /api/events/{id}`. */
export type EventDetail = Pick<
  EventSummary,
  'id' | 'name' | 'type' | 'dateTime' | 'highDemand' | 'saleStart'
> & {
  description: string | null
  status: EventStatus
  venue: Venue & { latitude: number; longitude: number }
  /** Sin máximo, el evento no limita las entradas por persona. */
  maxTicketsPerCustomer: number | null
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
