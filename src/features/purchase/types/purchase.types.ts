import type {
  EventDetail,
  EventSector,
  SeatAvailability,
  SectorAvailability,
} from '@/shared/types/event.types'
import type { SEAT_STATUSES } from '../constants/seats.constants'

export type SeatId = SeatAvailability['seatId']
export type SeatStatus = (typeof SEAT_STATUSES)[number]

/** Un aviso en dos partes: `lead` se destaca y `hint` dice qué hacer. */
export type AlertMessage = { lead: string; hint: string }

/** Qué le pasó a la cantidad elegida cuando un refresco trajo otros lugares libres. */
export type QuantityChange = 'NONE' | 'LOWERED' | 'SOLD_OUT'

/** Lo que el panel de cantidad muestra de un sector no numerado. */
export type UnnumberedSector = Pick<
  SectorAvailability,
  'eventSectorId' | 'sectorName' | 'availablePlaces'
> &
  Pick<EventSector, 'capacity'> &
  Pick<EventDetail, 'maxTicketsPerCustomer'>

/** Una línea de "Tu selección": un asiento, o la cantidad de un sector no numerado. */
export type SelectionLine = { key: number; label: string; price: number }

/** `count` son los lugares elegidos, para el contador "N/M". */
export type SelectionSummary = { lines: SelectionLine[]; total: number; count: number }

/** El estado del "−" / cantidad / "+" y sus acciones. */
export type QuantityStepper = {
  quantity: number
  canDecrease: boolean
  canIncrease: boolean
  increase: () => void
  decrease: () => void
}
