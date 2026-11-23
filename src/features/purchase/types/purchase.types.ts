import type { SeatAvailability } from '@/shared/types/event.types'
import type { SEAT_STATUSES } from '../constants/seats.constants'

export type SeatId = SeatAvailability['seatId']
export type SeatStatus = (typeof SEAT_STATUSES)[number]

/** Un aviso en dos partes: `lead` se destaca y `hint` dice qué hacer. */
export type AlertMessage = { lead: string; hint: string }
