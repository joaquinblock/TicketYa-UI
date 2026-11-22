import type { EventFilters, EventSummary, Page } from '../types/catalog.types'

export async function searchEvents(
  _filters: EventFilters,
  _size: number,
): Promise<Page<EventSummary>> {
  return { content: [], page: 0, size: 0, totalElements: 0, totalPages: 0 }
}
