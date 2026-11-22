import type { EventType } from '../../types/catalog.types'

/** Bloque de color por tipo mientras el evento no tenga imagen (#33). */
export const EVENT_TYPE_BLOCK_CLASS = {
  CONCERT: 'bg-accent',
  FESTIVAL: 'bg-warning',
  THEATER: 'bg-error',
  SPORTS: 'bg-success',
  CONFERENCE: 'bg-line',
} as const satisfies Record<EventType, string>
