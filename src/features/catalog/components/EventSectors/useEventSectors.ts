import { isAvailabilityVisible, joinSectorsWithAvailability } from '../../domain/sectorAvailability'
import { useEventAvailability } from '../../hooks/useEventAvailability'
import type { EventDetail } from '../../types/catalog.types'

/** Los sectores del detalle con su disponibilidad, que solo se pide si se puede mostrar. */
export function useEventSectors(event: EventDetail) {
  const showsAvailability = isAvailabilityVisible(event, new Date())
  const { availability, isPending } = useEventAvailability(showsAvailability ? event.id : undefined)
  const sectors = joinSectorsWithAvailability(event.sectors, availability?.sectors ?? [])

  return { sectors, isLoading: showsAvailability && isPending }
}
