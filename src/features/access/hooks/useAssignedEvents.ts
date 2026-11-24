import { useQueries, useQuery } from '@tanstack/react-query'
import { getErrorMessage } from '@/shared/lib/http/errorMessage'
import type { EventDetail } from '@/shared/types/event.types'
import { accessKeys } from '../lib/access.queryKeys'
import { getAssignedEvent, getOwnAssignments } from '../services/access.service'

const LOAD_ERROR_MESSAGE = 'No pudimos cargar tus eventos.'

/** Los eventos donde el personal está asignado, del más próximo al más lejano. */
export function useAssignedEvents() {
  const assignmentsQuery = useQuery({
    queryKey: accessKeys.assignments(),
    queryFn: getOwnAssignments,
  })
  const eventIds = (assignmentsQuery.data ?? []).map((assignment) => assignment.eventId)
  const eventQueries = useQueries({
    queries: eventIds.map((eventId) => ({
      queryKey: accessKeys.event(eventId),
      queryFn: () => getAssignedEvent(eventId),
    })),
  })

  const events = eventQueries
    .flatMap((query) => (query.data ? [query.data] : []))
    .sort((a: EventDetail, b: EventDetail) => a.dateTime.localeCompare(b.dateTime))
  const error = assignmentsQuery.error ?? eventQueries.find((query) => query.error)?.error

  return {
    events,
    isLoading: assignmentsQuery.isPending || eventQueries.some((query) => query.isPending),
    loadError: error ? getErrorMessage(error, LOAD_ERROR_MESSAGE) : undefined,
    retry: () => {
      void assignmentsQuery.refetch()
      eventQueries.forEach((query) => void query.refetch())
    },
  }
}
