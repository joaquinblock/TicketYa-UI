import type { EventDetail, SectorAvailability } from '@/shared/types/event.types'
import { joinSectorsWithAvailability } from '@/shared/utils/sectorAvailability'
import type { UnnumberedSector } from '../types/purchase.types'

/**
 * El sector abierto, si no es numerado, con lo que el panel de cantidad necesita del detalle: la
 * disponibilidad no trae la capacidad ni el límite por persona.
 */
export function toUnnumberedSector(
  event: EventDetail | undefined,
  openSector: SectorAvailability | undefined,
): UnnumberedSector | undefined {
  if (!event || !openSector || openSector.numbered) return undefined
  const [detail] = joinSectorsWithAvailability(event.sectors, [openSector]).filter(
    (sector) => sector.availability,
  )
  if (!detail) return undefined
  return {
    sectorName: openSector.sectorName,
    availablePlaces: openSector.availablePlaces,
    capacity: detail.capacity,
    maxTicketsPerCustomer: event.maxTicketsPerCustomer,
  }
}
