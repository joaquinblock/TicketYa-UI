import { useMutation } from '@tanstack/react-query'
import { cancelOrder } from '../services/payment.service'
import type { Order } from '../types/payment.types'

export function useCancelOrder() {
  return useMutation<Order, unknown, number>({
    mutationFn: (orderId) => cancelOrder(orderId),
  })
}
