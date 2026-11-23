import { useQuery } from '@tanstack/react-query'
import { EVENTS_PAGE_SIZE } from '../constants/catalog.constants'
import { catalogKeys } from '../lib/catalog.queryKeys'
import { searchEvents } from '../services/events.service'
import type { EventFilters } from '../types/catalog.types'

export function useEventSearch(filters: EventFilters) {
  return useQuery({
    queryKey: catalogKeys.events(filters),
    queryFn: () => searchEvents(filters, EVENTS_PAGE_SIZE),
  })
}
