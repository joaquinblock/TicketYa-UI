import { apiClient } from '@/shared/lib/http/apiClient'
import type { EventDetail, EventFilters, EventSummary, Page } from '../types/catalog.types'

const EVENTS_ENDPOINT = '/api/events'

/** En la URL la página empieza en 1; el backend cuenta desde 0. */
export function searchEvents({ page, ...filters }: EventFilters, size: number) {
  return apiClient.get<Page<EventSummary>>(EVENTS_ENDPOINT, {
    params: { ...filters, page: page - 1, size },
  })
}

export function getEvent(id: number) {
  return apiClient.get<EventDetail>(`${EVENTS_ENDPOINT}/${id}`)
}
