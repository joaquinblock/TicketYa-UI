import { useEvent } from '@/shared/hooks/useEvent'
import { useEventAvailability } from '@/shared/hooks/useEventAvailability'
import type { SeatAvailability } from '@/shared/types/event.types'
import { parseEventId } from '@/shared/utils/eventId'
import { useOpenSector } from '../../hooks/useOpenSector'
import { useSeatSelection } from '../../hooks/useSeatSelection'

/** Una referencia fija: con un `[]` nuevo en cada render, la selección creería que llegaron asientos. */
const NO_SEATS: SeatAvailability[] = []

export function useSeatsPageController(eventIdParam: string) {
  const eventId = parseEventId(eventIdParam)
  const eventQuery = useEvent(eventId)
  const availabilityQuery = useEventAvailability(eventId)
  const sectors = availabilityQuery.availability?.sectors
  const { openSector, openSectorById } = useOpenSector(sectors ?? [])
  const { selection, takenSeats, toggle, clear } = useSeatSelection(openSector?.seats ?? NO_SEATS)

  /** La selección es de un solo sector: al cambiar de pestaña se vacía. */
  const openSectorAndClearSelection = (eventSectorId: number) => {
    openSectorById(eventSectorId)
    clear()
  }

  // Sin precios, reintentar no lo arregla: manda aunque el evento también falle.
  const isNotForSale = availabilityQuery.isNotForSale
  // Si falla un refresco con los datos en pantalla, quedan los últimos: el error es solo sin datos.
  const hasLoadError =
    !isNotForSale &&
    ((eventQuery.isError && !eventQuery.event) || (availabilityQuery.isError && !sectors))
  const retryLoad = () => {
    void eventQuery.refetch()
    void availabilityQuery.refetch()
  }

  return {
    event: eventQuery.event,
    sectors,
    isNotForSale,
    hasLoadError,
    retryLoad,
    openSector,
    openSectorById: openSectorAndClearSelection,
    selection,
    takenSeats,
    toggleSeat: toggle,
  }
}
