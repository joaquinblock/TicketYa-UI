import { apiClient } from '@/shared/lib/http/apiClient'
import type { Order, PayOrderPayload } from '../types/payment.types'

const ORDERS_ENDPOINT = '/api/orders'

export function getOrder(orderId: number): Promise<Order> {
  return apiClient.get<Order>(`${ORDERS_ENDPOINT}/${orderId}`)
}

export function getOrders(): Promise<Order[]> {
  return apiClient.get<Order[]>(ORDERS_ENDPOINT)
}

export function payOrder(orderId: number, payload: PayOrderPayload): Promise<Order> {
  return apiClient.post<Order>(`${ORDERS_ENDPOINT}/${orderId}/pay`, payload)
}

export function cancelOrder(orderId: number): Promise<Order> {
  return apiClient.post<Order>(`${ORDERS_ENDPOINT}/${orderId}/cancel`)
}
