import { apiClient } from '@/shared/lib/http/apiClient'
import { EVENTS_ENDPOINT } from '@/shared/services/events.service'
import type { EventFilters, EventSummary, Page } from '../types/catalog.types'

/** En la URL la página empieza en 1; el backend cuenta desde 0. */
export function searchEvents({ page, ...filters }: EventFilters, size: number) {
  return apiClient.get<Page<EventSummary>>(EVENTS_ENDPOINT, {
    params: { ...filters, page: page - 1, size },
  })
}
