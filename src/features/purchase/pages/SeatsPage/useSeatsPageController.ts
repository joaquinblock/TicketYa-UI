import { useEvent } from '@/shared/hooks/useEvent'
import { parseEventId } from '@/shared/utils/eventId'

export function useSeatsPageController(eventIdParam: string) {
  const { event } = useEvent(parseEventId(eventIdParam))

  return { event }
}
