import { useEvent } from '@/shared/hooks/useEvent'
import { useEventAvailability } from '@/shared/hooks/useEventAvailability'
import { parseEventId } from '@/shared/utils/eventId'
import { useOpenSector } from '../../hooks/useOpenSector'
import { useSeatSelection } from '../../hooks/useSeatSelection'

export function useSeatsPageController(eventIdParam: string) {
  const eventId = parseEventId(eventIdParam)
  const { event } = useEvent(eventId)
  const { availability } = useEventAvailability(eventId)
  const sectors = availability?.sectors
  const { openSector, openSectorById } = useOpenSector(sectors ?? [])
  const { selection, toggle } = useSeatSelection()

  return { event, sectors, openSector, openSectorById, selection, toggleSeat: toggle }
}
