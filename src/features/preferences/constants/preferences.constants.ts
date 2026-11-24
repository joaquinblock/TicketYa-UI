import type { EventType } from '@/shared/types/event.types'

/** Etiquetas en plural para los chips de tipos de evento en Preferencias. */
export const PREFERENCES_EVENT_TYPE_LABEL = {
  CONCERT: 'Recitales',
  FESTIVAL: 'Festivales',
  THEATER: 'Teatro',
  SPORTS: 'Deportes',
  CONFERENCE: 'Conferencias',
} as const satisfies Record<EventType, string>

export const FAVORITE_SUGGESTIONS_LIMIT = 4
