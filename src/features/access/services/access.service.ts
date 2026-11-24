import { apiClient } from '@/shared/lib/http/apiClient'
import type { EventDetail } from '@/shared/types/event.types'
import type { AccessAssignment, AccessUser, CheckInResponse } from '../types/access.types'

/** Los eventos donde el personal del token puede validar entradas. */
export function getOwnAssignments(): Promise<AccessAssignment[]> {
  return apiClient.get<AccessAssignment[]>('/api/users/me/access-assignments')
}

export function getAssignedEvent(eventId: number): Promise<EventDetail> {
  return apiClient.get<EventDetail>(`/api/events/${eventId}`)
}

/** Si la entrada es del evento y no se usó, queda usada: un QR entra una sola vez. */
export function checkIn(eventId: number, qrCode: string): Promise<CheckInResponse> {
  return apiClient.post<CheckInResponse>('/api/tickets/check-in', { eventId, qrCode })
}

export function getAccessUser(): Promise<AccessUser> {
  return apiClient.get<AccessUser>('/api/users/me')
}
