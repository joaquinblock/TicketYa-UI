import type { EventType } from '@/shared/types/event.types'

export type AdminEventStatus = 'PUBLISHED' | 'SOLD_OUT' | 'SUSPENDED' | 'CANCELLED' | 'FINISHED'

/** Un evento del listado del administrador (`GET /api/events/admin`). */
export type AdminEvent = {
  id: number
  name: string
  type: EventType
  status: AdminEventStatus
  dateTime: string
  venueName: string
  city: string
  organizationId: number
}

export type AdminEventAction = 'suspend' | 'resume' | 'cancel'

export type AdminEventStatusFilter = AdminEventStatus | 'ALL'
