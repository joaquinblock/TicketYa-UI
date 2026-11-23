import { useMutation } from '@tanstack/react-query'
import { payOrder } from '../services/payment.service'
import type { Order, PayOrderPayload } from '../types/payment.types'

type PayOrderVariables = { orderId: number; payload: PayOrderPayload }

export function usePayOrder() {
  return useMutation<Order, unknown, PayOrderVariables>({
    mutationFn: ({ orderId, payload }) => payOrder(orderId, payload),
  })
}
