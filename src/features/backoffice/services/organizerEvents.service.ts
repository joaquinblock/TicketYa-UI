import { apiClient } from '@/shared/lib/http/apiClient'
import type { Organizer, OrganizerEvent, OrganizerEventAction } from '../types/organizerEvent.types'

/** Todos los eventos de la organización del token, en cualquier estado, del más nuevo al más viejo. */
export function getOwnEvents(): Promise<OrganizerEvent[]> {
  return apiClient.get<OrganizerEvent[]>('/api/events/mine')
}

/** Borrar es un `DELETE`; el resto, un `POST` a `/api/events/{id}/{acción}`. */
export function runOrganizerEventAction(
  eventId: number,
  action: OrganizerEventAction,
): Promise<unknown> {
  if (action === 'delete') return apiClient.delete(`/api/events/${eventId}`)
  return apiClient.post(`/api/events/${eventId}/${action}`)
}

export function getOrganizer(userId: number): Promise<Organizer> {
  return apiClient.get<Organizer>(`/api/organizers/${userId}`)
}
