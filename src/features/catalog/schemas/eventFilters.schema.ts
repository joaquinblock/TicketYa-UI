import { z } from 'zod'
import {
  DEFAULT_EVENT_SORT,
  EVENT_SORTS,
  EVENT_TYPES,
  FIRST_PAGE,
  MAX_QUERY_LENGTH,
} from '../constants/catalog.constants'
import type { EventFilters } from '../types/catalog.types'

const optionalTrimmedText = z
  .string()
  .transform((text) => text.trim() || undefined)
  .optional()
  .catch(undefined)

const eventFiltersSchema = z
  .object({
    q: optionalTrimmedText.transform((text) => text?.slice(0, MAX_QUERY_LENGTH)),
    type: z.enum(EVENT_TYPES).optional().catch(undefined),
    city: optionalTrimmedText,
    from: z.iso.date().optional().catch(undefined),
    to: z.iso.date().optional().catch(undefined),
    sort: z.enum(EVENT_SORTS).catch(DEFAULT_EVENT_SORT),
    page: z.coerce.number().int().min(FIRST_PAGE).catch(FIRST_PAGE),
  })
  .transform((filters) => sortByDateWithoutQuery(dropInvertedRangeEnd(filters)))

/** El backend rechaza `to` anterior a `from`: se conserva `from`, que es lo que se eligió primero. */
function dropInvertedRangeEnd<T extends Pick<EventFilters, 'from' | 'to'>>(filters: T): T {
  const isInverted = filters.from && filters.to && filters.to < filters.from
  return isInverted ? { ...filters, to: undefined } : filters
}

/** Sin texto buscado no hay relevancia que medir. */
function sortByDateWithoutQuery<T extends Pick<EventFilters, 'q' | 'sort'>>(filters: T): T {
  const isRelevanceWithoutQuery = filters.sort === 'RELEVANCE' && !filters.q
  return isRelevanceWithoutQuery ? { ...filters, sort: DEFAULT_EVENT_SORT } : filters
}

export function parseEventFilters(searchParams: URLSearchParams): EventFilters {
  return eventFiltersSchema.parse(Object.fromEntries(searchParams))
}
