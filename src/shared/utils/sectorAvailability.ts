import type {
  EventSector,
  SectorAvailability,
  SectorWithAvailability,
} from '@/shared/types/event.types'

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
