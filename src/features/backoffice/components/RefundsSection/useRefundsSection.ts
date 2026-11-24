import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'
import { getErrorMessage } from '@/shared/lib/http/errorMessage'
import { getEvent } from '@/shared/services/events.service'
import {
  DEFAULT_RETURN_REQUEST_FILTER,
  RESOLUTION_META,
} from '../../constants/returnRequests.constants'
import { backofficeKeys } from '../../lib/backoffice.queryKeys'
import { getReturnRequests, resolveReturnRequest } from '../../services/returnRequests.service'
import type { ReturnRequestFilter, ReturnRequestResolution } from '../../types/returnRequest.types'

const LOAD_ERROR_MESSAGE = 'No pudimos cargar las solicitudes de devolución.'
const RESOLVE_ERROR_MESSAGE = 'No pudimos resolver la solicitud. Probá de nuevo.'

type PendingResolution = { id: number; resolution: ReturnRequestResolution }

/** Las solicitudes de la pestaña elegida, con el nombre de su evento, y aprobarlas o rechazarlas. */
export function useRefundsSection() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<ReturnRequestFilter>(DEFAULT_RETURN_REQUEST_FILTER)
  const [page, setPage] = useState(0)
  const [pendingResolution, setPendingResolution] = useState<PendingResolution>()
  const [resultMessage, setResultMessage] = useState<string>()

  const requestsQuery = useQuery({
    queryKey: backofficeKeys.returnRequestPage(filter, page),
    queryFn: () => getReturnRequests(filter, page),
    placeholderData: keepPreviousData,
  })
  const requests = requestsQuery.data?.content ?? []

  const eventIds = [...new Set(requests.map((request) => request.eventId))]
  const eventQueries = useQueries({
    queries: eventIds.map((eventId) => ({
      queryKey: ['backoffice', 'event', eventId],
      queryFn: () => getEvent(eventId),
      staleTime: 60_000,
    })),
  })
  const eventsById = new Map(
    eventQueries.flatMap((query) => (query.data ? [[query.data.id, query.data] as const] : [])),
  )

  const resolveMutation = useMutation({
    mutationFn: ({ id, resolution }: PendingResolution) => resolveReturnRequest(id, resolution),
    meta: { handlesErrorInline: true },
    onSuccess: (_data, { resolution }) => {
      setResultMessage(RESOLUTION_META[resolution].result)
      setPendingResolution(undefined)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: backofficeKeys.returnRequests() }),
  })

  return {
    filter,
    selectFilter: (next: ReturnRequestFilter) => {
      setFilter(next)
      setPage(0)
      setPendingResolution(undefined)
    },
    requests,
    eventsById,
    isLoading: requestsQuery.isPending,
    loadError: requestsQuery.error
      ? getErrorMessage(requestsQuery.error, LOAD_ERROR_MESSAGE)
      : undefined,
    page,
    totalPages: requestsQuery.data?.totalPages ?? 0,
    totalElements: requestsQuery.data?.totalElements ?? 0,
    goToPage: setPage,
    pendingResolution,
    askResolution: (id: number, resolution: ReturnRequestResolution) => {
      resolveMutation.reset()
      setResultMessage(undefined)
      setPendingResolution({ id, resolution })
    },
    cancelResolution: () => setPendingResolution(undefined),
    confirmResolution: () => pendingResolution && resolveMutation.mutate(pendingResolution),
    isResolving: resolveMutation.isPending,
    resolveError: resolveMutation.error
      ? getErrorMessage(resolveMutation.error, RESOLVE_ERROR_MESSAGE)
      : undefined,
    resultMessage,
  }
}
