import { useQuery } from '@tanstack/react-query'
import { AVAILABILITY_REFETCH_INTERVAL_MS } from '../constants/event.constants'
import { eventKeys } from '../lib/event.queryKeys'
import { getAvailability } from '../services/availability.service'

/** Sin id no se pide nada: el evento no tiene lugares que se puedan mostrar. */
export function useEventAvailability(eventId: number | undefined) {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: eventKeys.availability(eventId),
    queryFn: () => {
      if (!eventId) throw new Error('useEventAvailability: falta el id del evento')
      return getAvailability(eventId)
    },
    enabled: Boolean(eventId),
    refetchInterval: AVAILABILITY_REFETCH_INTERVAL_MS,
    // Con 'always' vuelve a pedir al enfocar aunque el staleTime global todavía no haya vencido.
    refetchOnWindowFocus: 'always',
  })

  return { availability: data, isPending, isError, refetch }
}
