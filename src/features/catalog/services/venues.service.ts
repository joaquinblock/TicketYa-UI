import { apiClient } from '@/shared/lib/http/apiClient'
import type { Venue } from '../types/catalog.types'

const VENUES_ENDPOINT = '/api/venues'

/** El backend no tiene un endpoint de ciudades: salen de los lugares, sin repetir. */
export async function getCities(): Promise<string[]> {
  const venues = await apiClient.get<Venue[]>(VENUES_ENDPOINT)
  const cities = new Set(venues.map((venue) => venue.city))
  return [...cities].sort((first, second) => first.localeCompare(second, 'es'))
}
