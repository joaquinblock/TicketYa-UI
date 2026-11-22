import { z } from 'zod'
import {
  DEFAULT_EVENT_SORT,
  EVENT_SORTS,
  EVENT_TYPES,
  FIRST_PAGE,
} from '../constants/catalog.constants'
import type { EventFilters } from '../types/catalog.types'

const eventFiltersSchema = z
  .object({
    type: z.enum(EVENT_TYPES).optional().catch(undefined),
    from: z.iso.date().optional().catch(undefined),
    to: z.iso.date().optional().catch(undefined),
    sort: z.enum(EVENT_SORTS).catch(DEFAULT_EVENT_SORT),
    page: z.coerce.number().int().min(FIRST_PAGE).catch(FIRST_PAGE),
  })
  .transform(dropInvertedRangeEnd)

/** El backend rechaza `to` anterior a `from`: se conserva `from`, que es lo que se eligió primero. */
function dropInvertedRangeEnd<T extends Pick<EventFilters, 'from' | 'to'>>(filters: T): T {
  const isInverted = filters.from && filters.to && filters.to < filters.from
  return isInverted ? { ...filters, to: undefined } : filters
}

export function parseEventFilters(searchParams: URLSearchParams): EventFilters {
  return eventFiltersSchema.parse(Object.fromEntries(searchParams))
}
