import type { SeatAvailability } from '@/shared/types/event.types'
import { parseEventId } from '@/shared/utils/eventId'
import { useOpenSector } from '../../hooks/useOpenSector'
import { useSeatSelection } from '../../hooks/useSeatSelection'
import { useSeatsData } from '../../hooks/useSeatsData'
import { useSectorQuantity } from '../../hooks/useSectorQuantity'
import { toUnnumberedSector } from '../../domain/unnumberedSector'

/** Una referencia fija: con un `[]` nuevo en cada render, la selección creería que llegaron asientos. */
const NO_SEATS: SeatAvailability[] = []

/** Une los datos, el sector abierto y la selección, que #20 y #21 también van a usar. */
export function useSeatsPageController(eventIdParam: string) {
  const data = useSeatsData(parseEventId(eventIdParam))
  const { openSector, openSectorById } = useOpenSector(data.sectors ?? [])
  const { selection, takenSeats, toggle, clear } = useSeatSelection(openSector?.seats ?? NO_SEATS)
  const quantityStepper = useSectorQuantity()

  /** La selección es de un solo sector: al cambiar de pestaña se vacía. */
  const openSectorAndClearSelection = (eventSectorId: number) => {
    if (eventSectorId === openSector?.eventSectorId) return
    openSectorById(eventSectorId)
    clear()
  }

  return {
    ...data,
    openSector,
    openSectorById: openSectorAndClearSelection,
    selection,
    takenSeats,
    toggleSeat: toggle,
    unnumberedSector: toUnnumberedSector(data.event, openSector),
    quantityStepper,
  }
}
