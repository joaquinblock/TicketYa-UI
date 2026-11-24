import { apiClient } from '@/shared/lib/http/apiClient'
import type { AdminEvent, AdminEventAction } from '../types/adminEvent.types'

/** Todos los eventos salvo los borradores, en cualquier estado. Solo para el administrador. */
export function getAdminEvents(): Promise<AdminEvent[]> {
  return apiClient.get<AdminEvent[]>('/api/events/admin')
}

/** Suspender frena la venta, reanudar la vuelve a abrir y cancelar reintegra todas las entradas. */
export function runAdminEventAction(eventId: number, action: AdminEventAction): Promise<unknown> {
  return apiClient.post(`/api/events/${eventId}/${action}`)
}
