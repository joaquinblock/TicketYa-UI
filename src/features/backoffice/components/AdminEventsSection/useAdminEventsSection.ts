import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { getErrorMessage } from '@/shared/lib/http/errorMessage'
import { ADMIN_EVENT_ACTION_META } from '../../constants/adminEvents.constants'
import { backofficeKeys } from '../../lib/backoffice.queryKeys'
import { runAdminEventAction, getAdminEvents } from '../../services/adminEvents.service'
import { getOrganization } from '../../services/backoffice.service'
import type {
  AdminEvent,
  AdminEventAction,
  AdminEventStatusFilter,
} from '../../types/adminEvent.types'

const LOAD_ERROR_MESSAGE = 'No pudimos cargar los eventos.'
const ACTION_ERROR_MESSAGE = 'No pudimos cambiar el estado del evento. Probá de nuevo.'

type PendingAction = { event: AdminEvent; action: AdminEventAction }

function matchesQuery(event: AdminEvent, query: string): boolean {
  const text = `${event.name} ${event.venueName} ${event.city}`.toLowerCase()
  return text.includes(query.trim().toLowerCase())
}

/** Los eventos de la plataforma, filtrados, y suspenderlos, reanudarlos o cancelarlos con confirmación. */
export function useAdminEventsSection() {
  const queryClient = useQueryClient()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminEventStatusFilter>('ALL')
  const [pendingAction, setPendingAction] = useState<PendingAction>()
  const [cancelConfirmation, setCancelConfirmation] = useState('')
  const [resultMessage, setResultMessage] = useState<string>()

  const eventsQuery = useQuery({ queryKey: backofficeKeys.adminEvents(), queryFn: getAdminEvents })
  const allEvents = eventsQuery.data ?? []
  const events = allEvents.filter(
    (event) =>
      (statusFilter === 'ALL' || event.status === statusFilter) && matchesQuery(event, query),
  )

  const organizationIds = [...new Set(allEvents.map((event) => event.organizationId))]
  const organizationQueries = useQueries({
    queries: organizationIds.map((organizationId) => ({
      queryKey: backofficeKeys.organization(organizationId),
      queryFn: () => getOrganization(organizationId),
      staleTime: Infinity,
    })),
  })
  const organizationNames = new Map(
    organizationQueries.flatMap((organization) =>
      organization.data ? [[organization.data.id, organization.data.publicName] as const] : [],
    ),
  )

  const actionMutation = useMutation({
    mutationFn: ({ event, action }: PendingAction) => runAdminEventAction(event.id, action),
    meta: { handlesErrorInline: true },
    onSuccess: (_data, { event, action }) => {
      setResultMessage(ADMIN_EVENT_ACTION_META[action].result(event))
      setPendingAction(undefined)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: backofficeKeys.adminEvents() }),
  })

  const isCancelConfirmed =
    pendingAction?.action !== 'cancel' || cancelConfirmation === pendingAction.event.name

  return {
    events,
    organizationNames,
    isLoading: eventsQuery.isPending,
    loadError: eventsQuery.error
      ? getErrorMessage(eventsQuery.error, LOAD_ERROR_MESSAGE)
      : undefined,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    pendingAction,
    askAction: (event: AdminEvent, action: AdminEventAction) => {
      actionMutation.reset()
      setResultMessage(undefined)
      setCancelConfirmation('')
      setPendingAction({ event, action })
    },
    closeAction: () => setPendingAction(undefined),
    cancelConfirmation,
    setCancelConfirmation,
    canConfirmAction: isCancelConfirmed && !actionMutation.isPending,
    confirmAction: () => pendingAction && actionMutation.mutate(pendingAction),
    isRunningAction: actionMutation.isPending,
    actionError: actionMutation.error
      ? getErrorMessage(actionMutation.error, ACTION_ERROR_MESSAGE)
      : undefined,
    resultMessage,
  }
}
