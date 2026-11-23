import { apiClient } from '@/shared/lib/http/apiClient'
import type { EventAvailability } from '../types/event.types'

const AVAILABILITY_ENDPOINT = '/api/availability'

export function getAvailability(eventId: number) {
  return apiClient.get<EventAvailability>(AVAILABILITY_ENDPOINT, { params: { eventId } })
}
