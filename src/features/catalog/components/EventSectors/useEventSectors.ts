import {
  getPurchaseAction,
  isAvailabilityVisible,
  isPurchaseOpen,
  joinSectorsWithAvailability,
} from '../../domain/sectorAvailability'
import { useEventAvailability } from '../../hooks/useEventAvailability'
import type { EventDetail } from '../../types/catalog.types'

/**
 * Los sectores del detalle con su disponibilidad, que solo se pide si se puede mostrar, y la acción
 * de compra si la venta está abierta.
 */
export function useEventSectors(event: EventDetail) {
  const now = new Date()
  const showsAvailability = isAvailabilityVisible(event, now)
  const { availability, isPending } = useEventAvailability(showsAvailability ? event.id : undefined)
  const sectors = joinSectorsWithAvailability(event.sectors, availability?.sectors ?? [])
  const purchaseAction = isPurchaseOpen(event, now) ? getPurchaseAction(event) : undefined

  return { sectors, isLoading: showsAvailability && isPending, purchaseAction }
}
