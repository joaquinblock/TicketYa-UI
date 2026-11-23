import type { SeatId } from '../types/purchase.types'

export function toggleSeat(selection: SeatId[], seatId: SeatId) {
  return selection.includes(seatId)
    ? selection.filter((selected) => selected !== seatId)
    : [...selection, seatId]
}
