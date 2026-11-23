import { apiClient } from '@/shared/lib/http/apiClient'
import { getAccessToken, saveAccessToken } from '@/shared/lib/session'
import { QUEUE_SEEDER_CLIENT_USER_ID } from '../constants/queue.constants'
import type { QueueEntry } from '../types/queue.types'

const DEV_LOGIN_ENDPOINT = '/api/auth/dev-login'

export async function ensureDevClientSession(): Promise<void> {
  if (!import.meta.env.DEV || getAccessToken()) return
  const { accessToken } = await apiClient.post<{ accessToken: string }>(DEV_LOGIN_ENDPOINT, {
    userId: QUEUE_SEEDER_CLIENT_USER_ID,
  })
  saveAccessToken(accessToken)
}

export function joinQueue(eventId: number): Promise<QueueEntry> {
  return apiClient.post<QueueEntry>(`/api/queue/${eventId}/join`)
}

export function getQueueStatus(eventId: number): Promise<QueueEntry> {
  return apiClient.get<QueueEntry>(`/api/queue/${eventId}/me`)
}
