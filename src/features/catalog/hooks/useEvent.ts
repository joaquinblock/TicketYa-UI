import { useQuery } from '@tanstack/react-query'
import { catalogKeys } from '../lib/catalog.queryKeys'
import { getEvent } from '../services/events.service'

/** Sin id válido no se pide nada: la página ya sabe que el evento no existe. */
export function useEvent(id: number | undefined) {
  return useQuery({
    queryKey: catalogKeys.event(id),
    queryFn: () => {
      if (!id) throw new Error('useEvent: falta el id del evento')
      return getEvent(id)
    },
    enabled: Boolean(id),
  })
}
