import { useEvent } from '@/shared/hooks/useEvent'
import { useEventAvailability } from '@/shared/hooks/useEventAvailability'
import { parseEventId } from '@/shared/utils/eventId'
import { useOpenSector } from '../../hooks/useOpenSector'

export function useSeatsPageController(eventIdParam: string) {
  const eventId = parseEventId(eventIdParam)
  const { event } = useEvent(eventId)
  const { availability } = useEventAvailability(eventId)
  const { openSector } = useOpenSector(availability?.sectors ?? [])

  return { event, openSector }
}
