import { apiClient } from '@/shared/lib/http/apiClient'
import type { Order } from '../types/payment.types'
import type { ReservationRequest } from '../types/purchase.types'

const ORDERS_ENDPOINT = '/api/orders'

/** Crea la orden PENDING: los lugares quedan guardados mientras el cliente paga. */
export function createReservation(request: ReservationRequest): Promise<Order> {
  return apiClient.post<Order>(ORDERS_ENDPOINT, request)
}
