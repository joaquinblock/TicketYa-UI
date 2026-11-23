import { useQuery } from '@tanstack/react-query'
import { getEvent } from '@/shared/services/events.service'
import { parseEventId } from '@/shared/utils/eventId'
import { useQueueEntry } from '../../hooks/useQueueEntry'
import { classifyQueueError } from '../../utils/queueErrors'

export function useQueuePageController(eventIdParam: string) {
  const eventId = parseEventId(eventIdParam)
  const queue = useQueueEntry(eventId)
  const eventQuery = useQuery({
    queryKey: ['queue-event', eventId],
    enabled: eventId != null,
    queryFn: () => getEvent(eventId!),
    staleTime: 60_000,
    retry: false,
  })

  return {
    eventId,
    eventName: eventQuery.data?.name,
    ...queue,
    errorInfo: queue.isError ? classifyQueueError(queue.error) : null,
  }
}
