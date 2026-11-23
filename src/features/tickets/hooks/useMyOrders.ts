import { useQuery } from '@tanstack/react-query'
import { ticketsKeys } from '../lib/tickets.queryKeys'
import { ensureDevClientSession, getOrders } from '../services/orders.service'
import type { Order } from '../types/tickets.types'

function selectPaidOrdersNewestFirst(orders: Order[]): Order[] {
  return orders.filter((order) => order.status === 'PAID').sort((a, b) => b.id - a.id)
}

/** Obtiene las órdenes pagadas del cliente ordenadas de la más nueva a la más vieja. */
export function useMyOrders() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ticketsKeys.orders(),
    queryFn: async () => {
      await ensureDevClientSession()
      return getOrders()
    },
    select: selectPaidOrdersNewestFirst,
  })

  return {
    orders: data ?? [],
    isPending,
    isError,
    error,
    refetch,
  }
}
