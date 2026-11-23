import type { SeatAvailability } from '../types/event.types'

export function sortedRowsOf(seats: Pick<SeatAvailability, 'row'>[]) {
  const rows = [...new Set(seats.map((seat) => seat.row))]
  return rows.sort((first, second) => first.localeCompare(second, 'es', { numeric: true }))
}
