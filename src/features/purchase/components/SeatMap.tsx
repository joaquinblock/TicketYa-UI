import type { SeatAvailability, SectorAvailability } from '@/shared/types/event.types'
import { formatSeatAccessibleName } from '../utils/seatFormat'
import { groupSeatsByRow, type SeatRow } from '../utils/seatRows'

type SeatMapProps = { sector: SectorAvailability }

export function SeatMap({ sector }: SeatMapProps) {
  return (
    <section aria-label={`Mapa de ${sector.sectorName}`}>
      <div>Escenario</div>
      <div>
        {groupSeatsByRow(sector.seats ?? []).map((seatRow) => (
          <SeatRowLine key={seatRow.row} seatRow={seatRow} />
        ))}
      </div>
    </section>
  )
}

function SeatRowLine({ seatRow }: { seatRow: SeatRow }) {
  return (
    <div className="flex items-center">
      <span aria-hidden>{seatRow.row}</span>
      {seatRow.seats.map((seat) => (
        <SeatButton key={seat.seatId} seat={seat} />
      ))}
      <span aria-hidden>{seatRow.row}</span>
    </div>
  )
}

function SeatButton({ seat }: { seat: SeatAvailability }) {
  const status = seat.available ? 'AVAILABLE' : 'TAKEN'
  return (
    <button type="button" aria-label={formatSeatAccessibleName(seat, status)}>
      {seat.number}
    </button>
  )
}
