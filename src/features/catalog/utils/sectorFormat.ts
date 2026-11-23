import {
  LAST_PLACES_THRESHOLD,
  NUMBERED_SECTOR_LABEL,
  RETURN_NOTICE_HOURS,
  SOLD_OUT_PLACES_LABEL,
  UNNUMBERED_SECTOR_LABEL,
} from '../constants/sectorAvailability.constants'
import type { SectorAvailability } from '@/shared/types/event.types'
import { sortedRowsOf } from '@/shared/utils/seatRows'

const PERCENT = 100

type Occupancy = { capacity: number; availablePlaces: number }
type SectorKindInput = Pick<SectorAvailability, 'numbered' | 'seats'>

export function formatPlacesLeft(availablePlaces: number) {
  if (availablePlaces === 0) return SOLD_OUT_PLACES_LABEL
  if (availablePlaces < LAST_PLACES_THRESHOLD) return `Últimos ${availablePlaces} lugares`
  return `${availablePlaces.toLocaleString('es-AR')} disponibles`
}

export function formatSectorKind(sector: SectorKindInput) {
  if (!sector.numbered) return UNNUMBERED_SECTOR_LABEL
  const rows = sortedRowsOf(sector.seats ?? [])
  if (rows.length === 0) return NUMBERED_SECTOR_LABEL
  if (rows.length === 1) return `${NUMBERED_SECTOR_LABEL} · fila ${rows[0]}`
  return `${NUMBERED_SECTOR_LABEL} · filas ${rows[0]} a ${rows.at(-1)}`
}

/** La barra muestra lo ocupado, no lo libre: se llena a medida que se vende. */
export function getOccupancyPercent({ capacity, availablePlaces }: Occupancy) {
  return Math.round(((capacity - availablePlaces) / capacity) * PERCENT)
}

/** Sin máximo por persona, el texto avisa solo las devoluciones. */
export function formatPurchaseTerms(maxTicketsPerCustomer: number | null) {
  const returns = `Devoluciones hasta ${RETURN_NOTICE_HOURS} horas antes del evento`
  if (maxTicketsPerCustomer === null) return returns
  return `Hasta ${maxTicketsPerCustomer} entradas por persona · ${returns}`
}
