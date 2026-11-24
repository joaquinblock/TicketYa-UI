import { apiClient } from '@/shared/lib/http/apiClient'
import type { QueueEntry } from '../types/queue.types'

export function joinQueue(eventId: number): Promise<QueueEntry> {
  return apiClient.post<QueueEntry>(`/api/queue/${eventId}/join`)
}

export function getQueueStatus(eventId: number): Promise<QueueEntry> {
  return apiClient.get<QueueEntry>(`/api/queue/${eventId}/me`)
}
