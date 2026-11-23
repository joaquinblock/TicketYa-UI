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
  const { event } = useEvent(eventId)
  const { availability } = useEventAvailability(eventId)
  const sectors = availability?.sectors
  const { openSector, openSectorById } = useOpenSector(sectors ?? [])
  const { selection, takenSeats, toggle, clear } = useSeatSelection(openSector?.seats ?? NO_SEATS)

  /** La selección es de un solo sector: al cambiar de pestaña se vacía. */
  const openSectorAndClearSelection = (eventSectorId: number) => {
    openSectorById(eventSectorId)
    clear()
  }

  return {
    event,
    sectors,
    openSector,
    openSectorById: openSectorAndClearSelection,
    selection,
    takenSeats,
    toggleSeat: toggle,
  }
}
