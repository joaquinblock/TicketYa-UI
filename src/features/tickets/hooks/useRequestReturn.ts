import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsKeys } from '../lib/tickets.queryKeys'
import { requestTicketReturn } from '../services/orders.service'

/** Envía el pedido de devolución de una entrada e invalida las órdenes al confirmarse. */
export function useRequestReturn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: requestTicketReturn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ticketsKeys.orders() }),
  })
}
