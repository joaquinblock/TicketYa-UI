import { useState } from 'react'
import type { SeatAvailability } from '@/shared/types/event.types'
import { toggleSeat } from '../domain/seatSelection'
import { splitTakenSeats } from '../domain/takenSeats'
import type { SeatId } from '../types/purchase.types'

/**
 * La selección del sector abierto. Cuando llegan asientos nuevos (un refresco), los elegidos que
 * se ocuparon salen de la selección y quedan en `takenSeats` para el aviso.
 */
export function useSeatSelection(seats: SeatAvailability[]) {
  const [selection, setSelection] = useState<SeatId[]>([])
  const [takenSeats, setTakenSeats] = useState<SeatAvailability[]>([])
  const [previousSeats, setPreviousSeats] = useState(seats)

  // Se ajusta el estado durante el render: React vuelve a renderizar enseguida, sin mostrar la
  // selección vieja con los asientos nuevos.
  if (seats !== previousSeats) {
    setPreviousSeats(seats)
    const selected = previousSeats.filter((seat) => selection.includes(seat.seatId))
    const { kept, taken } = splitTakenSeats(selected, seats)
    if (taken.length > 0) {
      setSelection(kept)
      setTakenSeats(taken)
    }
  }

  // Cualquier elección nueva (otro asiento u otro sector) deja atrás el aviso.
  return {
    selection,
    takenSeats,
    toggle: (seatId: SeatId) => {
      setSelection((current) => toggleSeat(current, seatId))
      setTakenSeats([])
    },
    clear: () => {
      setSelection([])
      setTakenSeats([])
    },
  }
}
