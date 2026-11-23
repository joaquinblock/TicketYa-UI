import { useQuery } from '@tanstack/react-query'
import { paymentKeys } from '../lib/payment.queryKeys'
import { ensureDevClientSession, getOrder, getOrders } from '../services/payment.service'
import type { Order } from '../types/payment.types'

/**
 * Carga la orden a pagar: si llega `orderId` en la URL la pide directo;
 * si falta (por ejemplo al recargar), busca la orden `PENDING` del evento.
 */
export function usePendingOrder(eventId: number | undefined, orderId: number | undefined) {
  return useQuery<Order | null>({
    queryKey: paymentKeys.order(eventId ?? 0, orderId),
    enabled: eventId != null,
    queryFn: async () => {
      await ensureDevClientSession()
      if (orderId != null) return getOrder(orderId)
      const orders = await getOrders()
      return orders.find((o) => o.eventId === eventId && o.status === 'PENDING') ?? null
    },
  })
}
