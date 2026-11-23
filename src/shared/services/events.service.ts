import { apiClient } from '@/shared/lib/http/apiClient'
import type { EventDetail } from '../types/event.types'

export const EVENTS_ENDPOINT = '/api/events'

export function getEvent(id: number) {
  return apiClient.get<EventDetail>(`${EVENTS_ENDPOINT}/${id}`)
}
