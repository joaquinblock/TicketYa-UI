import type { SeatAvailability, SectorAvailability } from '@/shared/types/event.types'
import { seatStatusOf } from '../domain/seatSelection'
import type { SeatId } from '../types/purchase.types'
import { formatSeatAccessibleName } from '../utils/seatFormat'
import { groupSeatsByRow, type SeatRow } from '../utils/seatRows'

type SeatMapProps = {
  sector: SectorAvailability
  selection: SeatId[]
  onToggle: (seatId: SeatId) => void
}

type SeatChoice = Pick<SeatMapProps, 'selection' | 'onToggle'>

export function SeatMap({ sector, selection, onToggle }: SeatMapProps) {
  return (
    <section aria-label={`Mapa de ${sector.sectorName}`}>
      <div>Escenario</div>
      <div>
        {groupSeatsByRow(sector.seats ?? []).map((seatRow) => (
          <SeatRowLine
            key={seatRow.row}
            seatRow={seatRow}
            selection={selection}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  )
}

function SeatRowLine({ seatRow, ...choice }: SeatChoice & { seatRow: SeatRow }) {
  return (
    <div className="flex items-center">
      <span aria-hidden>{seatRow.row}</span>
      {seatRow.seats.map((seat) => (
        <SeatButton key={seat.seatId} seat={seat} {...choice} />
      ))}
      <span aria-hidden>{seatRow.row}</span>
    </div>
  )
}

function SeatButton({ seat, selection, onToggle }: SeatChoice & { seat: SeatAvailability }) {
  const status = seatStatusOf(seat, selection)
  return (
    <button
      type="button"
      aria-label={formatSeatAccessibleName(seat, status)}
      aria-pressed={status === 'SELECTED'}
      onClick={() => onToggle(seat.seatId)}
    >
      {seat.number}
    </button>
  )
}
