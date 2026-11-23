import type { EventFlagKind, EventType } from '../../types/catalog.types'

export const EVENT_FLAG_LABEL = {
  SOLD_OUT: 'Agotado',
  SALE_NOT_STARTED: 'Próximamente',
  HIGH_DEMAND: 'Alta demanda',
} as const satisfies Record<EventFlagKind, string>

/** Solo un badge va destacado (Von Restorff); los demás quedan neutros y legibles. */
export const HIGHLIGHTED_FLAG_CLASS = {
  SOLD_OUT: 'bg-ink text-surface',
  SALE_NOT_STARTED: 'bg-info text-info-ink',
  HIGH_DEMAND: 'bg-accent text-ink',
} as const satisfies Record<EventFlagKind, string>

export const NEUTRAL_FLAG_CLASS = 'bg-surface text-muted'

/** Bloque de color por tipo mientras el evento no tenga imagen (#33). */
export const EVENT_TYPE_BLOCK_CLASS = {
  CONCERT: 'bg-accent',
  FESTIVAL: 'bg-warning',
  THEATER: 'bg-error',
  SPORTS: 'bg-success',
  CONFERENCE: 'bg-line',
} as const satisfies Record<EventType, string>
