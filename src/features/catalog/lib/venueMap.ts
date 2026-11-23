import { GOOGLE_MAPS_SEARCH_URL } from '../constants/catalog.constants'
import type { EventDetail } from '../types/catalog.types'

type Coordinates = Pick<EventDetail['venue'], 'latitude' | 'longitude'>

export function getVenueMapUrl({ latitude, longitude }: Coordinates) {
  return `${GOOGLE_MAPS_SEARCH_URL}&query=${latitude},${longitude}`
}
