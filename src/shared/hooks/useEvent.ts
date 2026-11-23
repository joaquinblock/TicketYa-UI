import { useQuery } from '@tanstack/react-query'
import { ApiError } from '@/shared/lib/http/ApiError'
import { EVENT_NOT_FOUND_ERROR } from '../constants/event.constants'
import { eventKeys } from '../lib/event.queryKeys'
import { getEvent } from '../services/events.service'

/**
 * Sin id válido no se pide nada: el evento no existe. Del backend, solo `event_not_found` cuenta
 * como no encontrado; cualquier otro error es un error de carga.
 */
export function useEvent(id: number | undefined) {
  const { data, error, isPending, refetch } = useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => {
      if (!id) throw new Error('useEvent: falta el id del evento')
      return getEvent(id)
    },
    enabled: Boolean(id),
  })
  const isNotFound = !id || isEventNotFound(error)

  return { event: data, isNotFound, isPending, isError: Boolean(error) && !isNotFound, refetch }
}

function isEventNotFound(error: Error | null) {
  return error instanceof ApiError && error.code === EVENT_NOT_FOUND_ERROR
}
