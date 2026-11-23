import type { SeatAvailability } from '@/shared/types/event.types'

/**
 * Separa la selección según la disponibilidad nueva. Un asiento elegido que ya no viene en la
 * respuesta cuenta como ocupado. Los ocupados se devuelven con su fila y número de antes, para
 * poder nombrarlos en el aviso.
 */
export function splitTakenSeats(selected: SeatAvailability[], current: SeatAvailability[]) {
  const availableIds = new Set(current.filter((seat) => seat.available).map((seat) => seat.seatId))
  const isStillFree = (seat: SeatAvailability) => availableIds.has(seat.seatId)

  return {
    kept: selected.filter(isStillFree).map((seat) => seat.seatId),
    taken: selected.filter((seat) => !isStillFree(seat)),
  }
}
