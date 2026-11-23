import { useQuery } from '@tanstack/react-query'
import { ApiError } from '@/shared/lib/http/ApiError'
import { AVAILABILITY_REFETCH_INTERVAL_MS, NOT_FOR_SALE_ERROR } from '../constants/event.constants'
import { eventKeys } from '../lib/event.queryKeys'
import { getAvailability } from '../services/availability.service'

/**
 * Sin id no se pide nada: el evento no tiene lugares que se puedan mostrar. Del backend, solo
 * `resource_not_found` cuenta como "no está a la venta"; cualquier otro error es de carga.
 */
export function useEventAvailability(eventId: number | undefined) {
  const { data, error, isPending, refetch } = useQuery({
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
  const isNotForSale = !eventId || isNotForSaleError(error)

  return {
    availability: data,
    isPending,
    isError: Boolean(error),
    isNotForSale,
    refetch,
  }
}

function isNotForSaleError(error: Error | null) {
  return error instanceof ApiError && error.code === NOT_FOR_SALE_ERROR
}
