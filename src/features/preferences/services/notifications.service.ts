import { apiClient } from '@/shared/lib/http/apiClient'
import type { Notification } from '../types/notification.types'

const NOTIFICATIONS_ENDPOINT = '/api/notifications'

/** Los avisos del usuario autenticado, del más nuevo al más viejo. */
export function getMyNotifications(): Promise<Notification[]> {
  return apiClient.get<Notification[]>(NOTIFICATIONS_ENDPOINT)
}

/** Marca como leídos todos los avisos del usuario autenticado. */
export function markAllNotificationsRead(): Promise<void> {
  return apiClient.post<void>(`${NOTIFICATIONS_ENDPOINT}/read-all`)
}
