import type { SeatAvailability } from '@/shared/types/event.types'
import type { SeatId, SeatStatus } from '../types/purchase.types'

export function seatStatusOf(seat: SeatAvailability, selection: SeatId[]): SeatStatus {
  if (!seat.available) return 'TAKEN'
  return selection.includes(seat.seatId) ? 'SELECTED' : 'AVAILABLE'
}

export function toggleSeat(selection: SeatId[], seatId: SeatId) {
  return selection.includes(seatId)
    ? selection.filter((selected) => selected !== seatId)
    : [...selection, seatId]
}
