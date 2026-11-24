import type { EventType } from '@/shared/types/event.types'

export type OrganizerEventStatus =
  'DRAFT' | 'PUBLISHED' | 'SOLD_OUT' | 'SUSPENDED' | 'CANCELLED' | 'FINISHED'

/** Un evento de la organización del organizador (`GET /api/events/mine`), en cualquier estado. */
export type OrganizerEvent = {
  id: number
  name: string
  type: EventType
  status: OrganizerEventStatus
  dateTime: string
  highDemand: boolean
  organizationId: number
  createdBy: number
  photoUrl: string | null
  venue: { id: number; name: string; city: string }
}

export type OrganizerEventAction = 'publish' | 'delete' | 'suspend' | 'resume' | 'cancel'

export type OrganizerEventStatusFilter = OrganizerEventStatus | 'ALL'

/** Un organizador activo (`GET /api/organizers/{userId}`), para mostrar quién creó cada evento. */
export type Organizer = {
  userId: number
  firstName: string
  lastName: string
  organizationId: number
}
