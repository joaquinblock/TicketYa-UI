import type { EventFilters } from '../types/catalog.types'

export const catalogKeys = {
  all: ['catalog'] as const,
  events: (filters: EventFilters) => [...catalogKeys.all, 'events', filters] as const,
  cities: () => [...catalogKeys.all, 'cities'] as const,
}
