import {
  getPurchaseAction,
  isAvailabilityVisible,
  isPurchaseOpen,
} from '../../domain/sectorAvailability'
import { useEventAvailability } from '@/shared/hooks/useEventAvailability'
import type { EventDetail } from '@/shared/types/event.types'
import { joinSectorsWithAvailability } from '@/shared/utils/sectorAvailability'

/**
 * Los sectores del detalle con su disponibilidad, que solo se pide si se puede mostrar, y la acción
 * de compra si la venta está abierta.
 */
export function useEventSectors(event: EventDetail) {
  const now = new Date()
  const showsAvailability = isAvailabilityVisible(event, now)
  const { availability, isPending, isError, refetch } = useEventAvailability(
    showsAvailability ? event.id : undefined,
  )
  const sectors = joinSectorsWithAvailability(event.sectors, availability?.sectors ?? [])
  const purchaseAction = isPurchaseOpen(event, now) ? getPurchaseAction(event) : undefined

  return {
    sectors,
    isLoading: showsAvailability && isPending,
    // Si falla un refresco de los 30 s, quedan los últimos lugares que llegaron en vez del error.
    isError: isError && !availability,
    retry: () => void refetch(),
    purchaseAction,
  }
}
