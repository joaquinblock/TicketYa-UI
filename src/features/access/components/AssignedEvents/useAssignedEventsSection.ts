import { useAssignedEvents } from '../../hooks/useAssignedEvents'

const CLOSED_STATUSES = ['CANCELLED', 'FINISHED']

/**
 * El evento destacado es el próximo donde todavía se entra; el resto va en "Próximamente". Un solo
 * botón grande para la tarea principal (Hick): empezar a escanear.
 */
export function useAssignedEventsSection() {
  const { events, isLoading, loadError, retry } = useAssignedEvents()
  const featured = events.find((event) => !CLOSED_STATUSES.includes(event.status))
  const others = events.filter((event) => event !== featured)

  return { featured, others, hasEvents: events.length > 0, isLoading, loadError, retry }
}
