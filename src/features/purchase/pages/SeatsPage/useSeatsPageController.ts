import type { SeatAvailability } from '@/shared/types/event.types'
import { parseEventId } from '@/shared/utils/eventId'
import { useOpenSector } from '../../hooks/useOpenSector'
import { useSeatSelection } from '../../hooks/useSeatSelection'
import { useSeatsData } from '../../hooks/useSeatsData'
import { useSectorQuantity } from '../../hooks/useSectorQuantity'
import { summarizeSelection } from '../../domain/selectionSummary'
import { toUnnumberedSector } from '../../domain/unnumberedSector'

/** Una referencia fija: con un `[]` nuevo en cada render, la selección creería que llegaron asientos. */
const NO_SEATS: SeatAvailability[] = []

/** Une los datos, el sector abierto y la selección, que #20 y #21 también van a usar. */
export function useSeatsPageController(eventIdParam: string) {
  const data = useSeatsData(parseEventId(eventIdParam))
  const { openSector, openSectorById } = useOpenSector(data.sectors ?? [])
  const { selection, takenSeats, toggle, clear } = useSeatSelection(openSector?.seats ?? NO_SEATS)
  const unnumberedSector = toUnnumberedSector(data.event, openSector)
  const sectorQuantity = useSectorQuantity(unnumberedSector)

  /** La selección y la cantidad son de un solo sector: al cambiar de pestaña vuelven a empezar. */
  const openSectorAndClearSelection = (eventSectorId: number) => {
    if (eventSectorId === openSector?.eventSectorId) return
    openSectorById(eventSectorId)
    clear()
    sectorQuantity.reset()
  }

  const selectionSummary = summarizeSelection({
    sector: openSector,
    selection,
    quantity: unnumberedSector ? sectorQuantity.stepper.quantity : 0,
  })

  return {
    ...data,
    maxTicketsPerCustomer: data.event?.maxTicketsPerCustomer ?? null,
    selectionSummary,
    openSector,
    openSectorById: openSectorAndClearSelection,
    selection,
    takenSeats,
    toggleSeat: toggle,
    unnumberedSector,
    quantityStepper: sectorQuantity.stepper,
    quantityChange: sectorQuantity.change,
  }
}
