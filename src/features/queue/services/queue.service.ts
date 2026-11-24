import { apiClient } from '@/shared/lib/http/apiClient'
import type { QueueEntry } from '../types/queue.types'

export function joinQueue(eventId: number): Promise<QueueEntry> {
  return apiClient.post<QueueEntry>(`/api/queue/${eventId}/join`)
}

export function getQueueStatus(eventId: number): Promise<QueueEntry> {
  return apiClient.get<QueueEntry>(`/api/queue/${eventId}/me`)
}

/** Vacía la fila del evento y vuelve a poner la gente de prueba. Solo existe con el perfil `dev` del queue-service. */
export function resetQueue(eventId: number): Promise<void> {
  return apiClient.post<void>(`/api/queue/${eventId}/dev-reset`)
}
