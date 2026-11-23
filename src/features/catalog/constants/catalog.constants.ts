import type { EventSort, EventType, EventTypeLabel } from '../types/catalog.types'

/** En el orden en que se muestran los chips. */
export const EVENT_TYPES = ['CONCERT', 'FESTIVAL', 'THEATER', 'SPORTS', 'CONFERENCE'] as const

/** Plural para el filtro ("Recitales") y singular para la card ("Recital"). */
export const EVENT_TYPE_LABEL = {
  CONCERT: { plural: 'Recitales', singular: 'Recital' },
  FESTIVAL: { plural: 'Festivales', singular: 'Festival' },
  THEATER: { plural: 'Teatro', singular: 'Teatro' },
  SPORTS: { plural: 'Deportes', singular: 'Deporte' },
  CONFERENCE: { plural: 'Conferencias', singular: 'Conferencia' },
} as const satisfies Record<EventType, EventTypeLabel>

/** En el orden en que se muestran en "Ordenar por". */
export const EVENT_SORTS = ['DATE', 'PRICE', 'RELEVANCE'] as const

export const EVENT_SORT_LABEL = {
  DATE: 'Fecha',
  PRICE: 'Precio',
  RELEVANCE: 'Relevancia',
} as const satisfies Record<EventSort, string>

export const DEFAULT_EVENT_SORT = 'DATE' satisfies EventSort
export const FIRST_PAGE = 1

/** 8 por página: dentro del 7 ± 2 de Miller y 2 filas de 4 en escritorio. */
export const EVENTS_PAGE_SIZE = 8
export const SUGGESTIONS_SIZE = 5
export const MIN_SUGGESTION_LENGTH = 2
export const SEARCH_DEBOUNCE_MS = 300
/** Máximo que acepta el backend para `q`. */
export const MAX_QUERY_LENGTH = 100

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

/** Búsqueda de Google Maps por coordenadas: abre el pin sin API key. */
export const GOOGLE_MAPS_SEARCH_URL = 'https://www.google.com/maps/search/?api=1'

/** El badge del hero y el título del aviso dicen lo mismo. */
export const HIGH_DEMAND_LABEL = 'Alta demanda · fila virtual'
