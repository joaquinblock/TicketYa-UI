import { LAST_PLACES_THRESHOLD } from '../constants/sectorAvailability.constants'

const PERCENT = 100

type Occupancy = { capacity: number; availablePlaces: number }

export function formatPlacesLeft(availablePlaces: number) {
  if (availablePlaces < LAST_PLACES_THRESHOLD) return `Últimos ${availablePlaces} lugares`
  return `${availablePlaces.toLocaleString('es-AR')} disponibles`
}

/** La barra muestra lo ocupado, no lo libre: se llena a medida que se vende. */
export function getOccupancyPercent({ capacity, availablePlaces }: Occupancy) {
  return Math.round(((capacity - availablePlaces) / capacity) * PERCENT)
}
