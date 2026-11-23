import type { SeatAvailability } from '@/shared/types/event.types'
import { sortedRowsOf } from '@/shared/utils/seatRows'

export type SeatRow = { row: string; seats: SeatAvailability[] }

/** Las filas en orden alfabético y, dentro de cada una, los asientos por número. */
export function groupSeatsByRow(seats: SeatAvailability[]): SeatRow[] {
  return sortedRowsOf(seats).map((row) => ({
    row,
    seats: seats
      .filter((seat) => seat.row === row)
      .sort((first, second) => first.number - second.number),
  }))
}
