import { z } from 'zod'
import { DEFAULT_EVENT_SORT, EVENT_SORT, FIRST_PAGE } from '../constants/catalog.constants'
import type { EventFilters } from '../types/catalog.types'

const eventFiltersSchema = z.object({
  sort: z.enum(EVENT_SORT).catch(DEFAULT_EVENT_SORT),
  page: z.coerce.number().int().min(FIRST_PAGE).catch(FIRST_PAGE),
})

export function parseEventFilters(searchParams: URLSearchParams): EventFilters {
  return eventFiltersSchema.parse(Object.fromEntries(searchParams))
}
