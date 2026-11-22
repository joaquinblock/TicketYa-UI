export const EVENT_TYPE = {
  CONCERT: 'CONCERT',
  FESTIVAL: 'FESTIVAL',
  THEATER: 'THEATER',
  SPORTS: 'SPORTS',
  CONFERENCE: 'CONFERENCE',
} as const

/** Plural para el filtro ("Recitales") y singular para la card ("Recital"). */
export const EVENT_TYPE_LABEL = {
  CONCERT: { plural: 'Recitales', singular: 'Recital' },
  FESTIVAL: { plural: 'Festivales', singular: 'Festival' },
  THEATER: { plural: 'Teatro', singular: 'Teatro' },
  SPORTS: { plural: 'Deportes', singular: 'Deporte' },
  CONFERENCE: { plural: 'Conferencias', singular: 'Conferencia' },
} as const

export const EVENT_SORT = {
  DATE: 'DATE',
  PRICE: 'PRICE',
  RELEVANCE: 'RELEVANCE',
} as const

export const EVENT_SORT_LABEL = {
  DATE: 'Fecha',
  PRICE: 'Precio',
  RELEVANCE: 'Relevancia',
} as const

export const EVENT_STATUS = {
  PUBLISHED: 'PUBLISHED',
  SOLD_OUT: 'SOLD_OUT',
} as const

export const DEFAULT_EVENT_SORT = EVENT_SORT.DATE
export const FIRST_PAGE = 1

/** 8 por página: dentro del 7 ± 2 de Miller y 2 filas de 4 en escritorio. */
export const EVENTS_PAGE_SIZE = 8
export const SUGGESTIONS_SIZE = 5
export const MIN_SUGGESTION_LENGTH = 2
export const SEARCH_DEBOUNCE_MS = 300
/** Máximo que acepta el backend para `q`. */
export const MAX_QUERY_LENGTH = 100
