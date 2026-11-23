import { apiClient } from '@/shared/lib/http/apiClient'
import { getAccessToken, saveAccessToken } from '@/shared/lib/session'
import { SEEDER_CLIENT_USER_ID } from '../constants/tickets.constants'
import type { Order } from '../types/tickets.types'

const ORDERS_ENDPOINT = '/api/orders'
const DEV_LOGIN_ENDPOINT = '/api/auth/dev-login'

export function getOrders(): Promise<Order[]> {
  return apiClient.get<Order[]>(ORDERS_ENDPOINT)
}

/**
 * Mientras el flujo de login (#8) está postergado, en desarrollo autentica
 * automáticamente al cliente del seeder si todavía no hay token en sesión.
 */
export async function ensureDevClientSession(): Promise<void> {
  if (!import.meta.env.DEV || getAccessToken()) return
  const { accessToken } = await apiClient.post<{ accessToken: string }>(DEV_LOGIN_ENDPOINT, {
    userId: SEEDER_CLIENT_USER_ID,
  })
  saveAccessToken(accessToken)
}
