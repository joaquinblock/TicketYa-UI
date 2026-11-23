/** En el orden en que se muestran los chips. */
export const EVENT_TYPES = ['CONCERT', 'FESTIVAL', 'THEATER', 'SPORTS', 'CONFERENCE'] as const

export const MONTH_ABBREVIATIONS = [
  'ENE',
  'FEB',
  'MAR',
  'ABR',
  'MAY',
  'JUN',
  'JUL',
  'AGO',
  'SEP',
  'OCT',
  'NOV',
  'DIC',
] as const

/** Código del `ErrorDto` cuando el evento no existe o es un borrador. */
export const EVENT_NOT_FOUND_ERROR = 'event_not_found'

/** La disponibilidad se vuelve a pedir cada 30 s: alcanza sin WebSocket ni SSE. */
export const AVAILABILITY_REFETCH_INTERVAL_MS = 30_000
