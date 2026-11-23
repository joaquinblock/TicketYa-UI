import type { EventDetail, Venue } from '@/shared/types/event.types'
import { formatEventDateTime } from '@/shared/utils/eventFormat'

type EventHeaderInput = Pick<EventDetail, 'name' | 'dateTime'> & { venue: Pick<Venue, 'name'> }

/** `La casa de las sierras · 19 dic 2026 · 20:30 hs · Teatro de la Sierra` */
export function formatEventHeader({ name, dateTime, venue }: EventHeaderInput) {
  return `${name} · ${formatEventDateTime(dateTime)} · ${venue.name}`
}
