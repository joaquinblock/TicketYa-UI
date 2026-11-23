import type { EVENT_TYPES } from '../constants/event.constants'

export type EventType = (typeof EVENT_TYPES)[number]
/** Los estados de un evento visible: el borrador no se muestra. */
export type EventStatus = 'PUBLISHED' | 'SOLD_OUT' | 'SUSPENDED' | 'CANCELLED' | 'FINISHED'

export type Venue = {
  id: number
  name: string
  address: string
  city: string
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
export type EventDetail = {
  id: number
  name: string
  type: EventType
  /** Fecha y hora local del evento, sin zona (`2026-12-02T22:00:00`). */
  dateTime: string
  highDemand: boolean
  /** Apertura de la venta, en hora local sin zona como `dateTime`. Sin fecha, la venta ya está abierta. */
  saleStart: string | null
  description: string | null
  status: EventStatus
  venue: Venue & { latitude: number; longitude: number }
  /** Sin máximo, el evento no limita las entradas por persona. */
  maxTicketsPerCustomer: number | null
  sectors: EventSector[]
  participants: Participant[]
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
