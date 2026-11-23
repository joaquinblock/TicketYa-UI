import type { SectorAvailability } from '@/shared/types/event.types'
import type { SeatId, SelectionLine, SelectionSummary } from '../types/purchase.types'
import { groupSeatsByRow } from '../utils/seatRowGroups'

type SelectionSummaryInput = {
  sector: SectorAvailability | undefined
  selection: SeatId[]
  quantity: number
}

/** Lo que "Tu selección" muestra: una línea por asiento elegido, el total y cuántos son. */
export function summarizeSelection({ sector, selection }: SelectionSummaryInput): SelectionSummary {
  const seatsInMapOrder = groupSeatsByRow(sector?.seats ?? []).flatMap((row) => row.seats)
  const lines: SelectionLine[] = seatsInMapOrder
    .filter((seat) => selection.includes(seat.seatId))
    .map((seat) => ({
      key: seat.seatId,
      label: `${sector?.sectorName} · fila ${seat.row}, asiento ${seat.number}`,
      price: sector?.price ?? 0,
    }))
  return {
    lines,
    total: lines.reduce((sum, line) => sum + line.price, 0),
    count: lines.length,
  }
}
