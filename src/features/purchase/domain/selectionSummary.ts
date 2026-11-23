import type { SectorAvailability } from '@/shared/types/event.types'
import type { SeatId, SelectionLine, SelectionSummary } from '../types/purchase.types'
import { groupSeatsByRow } from '../utils/seatRowGroups'

type SelectionSummaryInput = {
  sector: SectorAvailability | undefined
  selection: SeatId[]
  quantity: number
}

/**
 * Lo que "Tu selección" muestra del sector abierto: una línea por asiento elegido, en el orden del
 * mapa, o una sola con la cantidad si el sector no es numerado.
 */
export function summarizeSelection({
  sector,
  selection,
  quantity,
}: SelectionSummaryInput): SelectionSummary {
  if (!sector) return { lines: [], total: 0, count: 0 }
  const lines = sector.numbered ? seatLines(sector, selection) : quantityLines(sector, quantity)
  const count = sector.numbered ? lines.length : quantity
  return { lines, total: lines.reduce((sum, line) => sum + line.price, 0), count }
}

function seatLines(sector: SectorAvailability, selection: SeatId[]): SelectionLine[] {
  const seatsInMapOrder = groupSeatsByRow(sector.seats ?? []).flatMap((row) => row.seats)
  return seatsInMapOrder
    .filter((seat) => selection.includes(seat.seatId))
    .map((seat) => ({
      key: seat.seatId,
      label: `${sector.sectorName} · fila ${seat.row}, asiento ${seat.number}`,
      price: sector.price,
    }))
}

function quantityLines(sector: SectorAvailability, quantity: number): SelectionLine[] {
  if (quantity === 0) return []
  return [
    {
      key: sector.eventSectorId,
      label: `${quantity} × ${sector.sectorName}`,
      price: quantity * sector.price,
    },
  ]
}
