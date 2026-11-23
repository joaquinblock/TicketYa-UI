import { hasSaleNotStarted } from '../lib/eventNotice'
import type {
  EventDetail,
  EventSector,
  SectorAvailability,
  SectorWithAvailability,
} from '../types/catalog.types'

/**
 * Los dos endpoints no comparten id de sector: se unen por nombre, que es único dentro del lugar.
 * Manda el orden del detalle.
 */
export function joinSectorsWithAvailability(
  sectors: EventSector[],
  availability: SectorAvailability[],
): SectorWithAvailability[] {
  const availabilityByName = new Map(availability.map((sector) => [sector.sectorName, sector]))
  return sectors.map((sector) => ({ ...sector, availability: availabilityByName.get(sector.name) }))
}

type SaleState = Pick<EventDetail, 'status' | 'saleStart'>

/** Solo se muestran lugares que se pueden comprar, o el agotado. */
export function isAvailabilityVisible(event: SaleState, now: Date) {
  return event.status === 'SOLD_OUT' || isPurchaseOpen(event, now)
}

export function isPurchaseOpen(event: SaleState, now: Date) {
  if (event.status !== 'PUBLISHED') return false
  return !event.saleStart || !hasSaleNotStarted(event.saleStart, now)
}
