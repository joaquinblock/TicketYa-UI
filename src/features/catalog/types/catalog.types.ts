import type { EventDetail, EventStatus, EventType, Venue } from '@/shared/types/event.types'
import type { EVENT_SORTS } from '../constants/catalog.constants'

export type EventSort = (typeof EVENT_SORTS)[number]
/** Los estados en que no se venden entradas: cada uno lleva su badge en el detalle. */
export type OffSaleStatus = Exclude<EventStatus, 'PUBLISHED'>
/** La cartelera solo muestra eventos publicados o agotados. */
export type BoardEventStatus = Extract<EventStatus, 'PUBLISHED' | 'SOLD_OUT'>

export type EventTypeLabel = { plural: string; singular: string }

/** Evento como lo devuelve `GET /api/events`. */
export type EventSummary = Pick<
  EventDetail,
  'id' | 'name' | 'type' | 'dateTime' | 'highDemand' | 'saleStart'
> & {
  status: BoardEventStatus
  venue: Pick<Venue, 'name' | 'city'>
  priceFrom: number
  participants: string[]
}

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
