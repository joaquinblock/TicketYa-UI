import { apiClient } from '@/shared/lib/http/apiClient'
import { getQueueTurn } from '@/shared/lib/queueToken'
import type { Order } from '../types/payment.types'
import type { ReservationRequest } from '../types/purchase.types'

const ORDERS_ENDPOINT = '/api/orders'

/** Crea la orden PENDING: los lugares quedan guardados mientras el cliente paga. */
export function createReservation(request: ReservationRequest): Promise<Order> {
  const turn = getQueueTurn(request.eventId)
  const config = turn ? { headers: { 'X-Queue-Token': turn.queueToken } } : undefined
  return apiClient.post<Order>(ORDERS_ENDPOINT, request, config)
}
