import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ApiError } from '@/shared/lib/http/ApiError'
import { getErrorMessage } from '@/shared/lib/http/errorMessage'
import { getSessionClaims } from '@/shared/lib/session'
import { ORGANIZER_EVENT_ACTION_META } from '../../constants/organizerEvents.constants'
import { backofficeKeys } from '../../lib/backoffice.queryKeys'
import {
  getOrganizer,
  getOwnEvents,
  runOrganizerEventAction,
} from '../../services/organizerEvents.service'
import type {
  OrganizerEvent,
  OrganizerEventAction,
  OrganizerEventStatusFilter,
} from '../../types/organizerEvent.types'

const LOAD_ERROR_MESSAGE = 'No pudimos cargar tus eventos.'
const ACTION_ERROR_MESSAGE = 'No pudimos cambiar el estado del evento. Probá de nuevo.'

type PendingAction = { event: OrganizerEvent; action: OrganizerEventAction }

function matchesQuery(event: OrganizerEvent, query: string): boolean {
  const text = `${event.name} ${event.venue.name} ${event.venue.city}`.toLowerCase()
  return text.includes(query.trim().toLowerCase())
}

/** Al publicar, el backend lista en `detail.problems` todo lo que le falta al borrador. */
function publishProblems(error: unknown): string[] {
  if (!(error instanceof ApiError)) return []
  const problems = error.detail?.problems
  return Array.isArray(problems) ? problems.filter((p): p is string => typeof p === 'string') : []
}

/**
 * Los eventos de la organización, filtrados, y sus acciones con confirmación. Suspender, reanudar
 * y cancelar quedan solo para quien creó el evento, la misma regla que aplica el backend.
 */
export function useOrganizerEventsSection() {
  const queryClient = useQueryClient()
  const currentUserId = getSessionClaims()?.userId
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrganizerEventStatusFilter>('ALL')
  const [pendingAction, setPendingAction] = useState<PendingAction>()
  const [nameConfirmation, setNameConfirmation] = useState('')
  const [resultMessage, setResultMessage] = useState<string>()

  const eventsQuery = useQuery({ queryKey: backofficeKeys.ownEvents(), queryFn: getOwnEvents })
  const allEvents = eventsQuery.data ?? []
  const events = allEvents.filter(
    (event) =>
      (statusFilter === 'ALL' || event.status === statusFilter) && matchesQuery(event, query),
  )

  const creatorIds = [...new Set(allEvents.map((event) => event.createdBy))]
  const creatorQueries = useQueries({
    queries: creatorIds.map((userId) => ({
      queryKey: backofficeKeys.organizer(userId),
      queryFn: () => getOrganizer(userId),
      staleTime: Infinity,
      retry: false,
    })),
  })
  const creatorNames = new Map(
    creatorQueries.flatMap((creator) =>
      creator.data
        ? [[creator.data.userId, `${creator.data.firstName} ${creator.data.lastName}`] as const]
        : [],
    ),
  )

  const actionMutation = useMutation({
    mutationFn: ({ event, action }: PendingAction) => runOrganizerEventAction(event.id, action),
    meta: { handlesErrorInline: true },
    onSuccess: (_data, { event, action }) => {
      setResultMessage(ORGANIZER_EVENT_ACTION_META[action].result(event))
      setPendingAction(undefined)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: backofficeKeys.ownEvents() }),
  })

  const isNameConfirmed =
    !pendingAction ||
    !ORGANIZER_EVENT_ACTION_META[pendingAction.action].requiresNameConfirmation ||
    nameConfirmation === pendingAction.event.name

  return {
    events,
    totalEvents: allEvents.length,
    isOwnEvent: (event: OrganizerEvent) => event.createdBy === currentUserId,
    creatorName: (event: OrganizerEvent) =>
      event.createdBy === currentUserId ? 'vos' : creatorNames.get(event.createdBy),
    isLoading: eventsQuery.isPending,
    loadError: eventsQuery.error
      ? getErrorMessage(eventsQuery.error, LOAD_ERROR_MESSAGE)
      : undefined,
    retryLoad: () => eventsQuery.refetch(),
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    clearFilters: () => {
      setQuery('')
      setStatusFilter('ALL')
    },
    pendingAction,
    askAction: (event: OrganizerEvent, action: OrganizerEventAction) => {
      actionMutation.reset()
      setResultMessage(undefined)
      setNameConfirmation('')
      setPendingAction({ event, action })
    },
    closeAction: () => setPendingAction(undefined),
    nameConfirmation,
    setNameConfirmation,
    canConfirmAction: isNameConfirmed && !actionMutation.isPending,
    confirmAction: () => pendingAction && actionMutation.mutate(pendingAction),
    isRunningAction: actionMutation.isPending,
    actionError: actionMutation.error
      ? getErrorMessage(actionMutation.error, ACTION_ERROR_MESSAGE)
      : undefined,
    actionProblems: publishProblems(actionMutation.error),
    resultMessage,
  }
}
