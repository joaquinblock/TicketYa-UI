import { useState } from 'react'
import { toggleSeat } from '../domain/seatSelection'
import type { SeatId } from '../types/purchase.types'

export function useSeatSelection() {
  const [selection, setSelection] = useState<SeatId[]>([])

  return {
    selection,
    toggle: (seatId: SeatId) => setSelection((current) => toggleSeat(current, seatId)),
    clear: () => setSelection([]),
  }
}
