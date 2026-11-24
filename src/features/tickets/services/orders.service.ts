import { apiClient } from '@/shared/lib/http/apiClient'
import type { Order, ReturnRequestResponse } from '../types/tickets.types'

const ORDERS_ENDPOINT = '/api/orders'

export function getOrders(): Promise<Order[]> {
  return apiClient.get<Order[]>(ORDERS_ENDPOINT)
}

export function requestTicketReturn(ticketId: number): Promise<ReturnRequestResponse> {
  return apiClient.post<ReturnRequestResponse>(`/api/tickets/${ticketId}/return-requests`)
}
