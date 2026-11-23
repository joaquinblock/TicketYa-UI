import type { EventType } from '@/shared/types/event.types'

/** Preferencias guardadas del cliente (`GET/PUT /api/preferences/me`). */
export type Preferences = {
  eventTypes: EventType[]
  participantIds: number[]
  city: string | null
}
