import type { EventFilters } from '../types/catalog.types'

export const catalogKeys = {
  all: ['catalog'] as const,
  events: (filters: EventFilters) => [...catalogKeys.all, 'events', filters] as const,
  cities: () => [...catalogKeys.all, 'cities'] as const,
  suggestions: (text: string) => [...catalogKeys.all, 'suggestions', text] as const,
  event: (id: number | undefined) => [...catalogKeys.all, 'event', id] as const,
}
