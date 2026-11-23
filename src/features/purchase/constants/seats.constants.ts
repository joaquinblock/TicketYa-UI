import type { SeatStatus } from '../types/purchase.types'

export const SOLD_OUT_TAB_LABEL = 'Agotado'

/** En el orden de la leyenda debajo del mapa. */
export const SEAT_STATUSES = ['AVAILABLE', 'TAKEN', 'SELECTED'] as const

export const SEAT_STATUS_LABEL = {
  AVAILABLE: 'Disponible',
  TAKEN: 'Ocupado',
  SELECTED: 'Elegido',
} as const satisfies Record<SeatStatus, string>
