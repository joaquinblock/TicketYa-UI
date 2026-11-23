import { hasSaleNotStarted } from '../../lib/eventNotice'
import type { EventFlag, EventFlagKind, EventSummary } from '../../types/catalog.types'

/**
 * Todos los badges que aplican, con el de la venta primero. Va destacado el de la venta si hay;
 * si no, el de alta demanda.
 */
export function useEventFlags(event: EventSummary): EventFlag[] {
  const saleFlag = getSaleFlag(event, new Date())
  const kinds: EventFlagKind[] = [
    ...(saleFlag ? [saleFlag] : []),
    ...(event.highDemand ? (['HIGH_DEMAND'] as const) : []),
  ]
  return kinds.map((kind, index) => ({ kind, isHighlighted: index === 0 }))
}

function getSaleFlag(event: EventSummary, now: Date): EventFlagKind | undefined {
  if (event.status === 'SOLD_OUT') return 'SOLD_OUT'
  if (event.saleStart && hasSaleNotStarted(event.saleStart, now)) return 'SALE_NOT_STARTED'
  return undefined
}
