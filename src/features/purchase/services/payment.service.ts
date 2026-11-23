import { apiClient } from '@/shared/lib/http/apiClient'
import { getAccessToken, saveAccessToken } from '@/shared/lib/session'
import { SEEDER_CLIENT_USER_ID } from '../constants/payment.constants'
import type { Order, PayOrderPayload } from '../types/payment.types'

const ORDERS_ENDPOINT = '/api/orders'
const DEV_LOGIN_ENDPOINT = '/api/auth/dev-login'

export async function ensureDevClientSession(): Promise<void> {
  if (!import.meta.env.DEV || getAccessToken()) return
  const { accessToken } = await apiClient.post<{ accessToken: string }>(DEV_LOGIN_ENDPOINT, {
    userId: SEEDER_CLIENT_USER_ID,
  })
  saveAccessToken(accessToken)
}

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
