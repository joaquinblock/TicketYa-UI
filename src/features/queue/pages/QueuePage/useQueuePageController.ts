import { useQuery } from '@tanstack/react-query'
import { isUnauthorizedError } from '@/shared/lib/http/ApiError'
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

  const isLoginRequired = queue.isError && isUnauthorizedError(queue.error)

  return {
    eventId,
    eventName: eventQuery.data?.name,
    ...queue,
    isLoginRequired,
    errorInfo: queue.isError && !isLoginRequired ? classifyQueueError(queue.error) : null,
  }
}
