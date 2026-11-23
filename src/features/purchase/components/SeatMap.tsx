import type { SeatAvailability, SectorAvailability } from '@/shared/types/event.types'
import { seatStatusOf } from '../domain/seatSelection'
import type { SeatId } from '../types/purchase.types'
import { formatSeatAccessibleName } from '../utils/seatFormat'
import { groupSeatsByRow, type SeatRow } from '../utils/seatRowGroups'
import { SeatLegend } from './SeatLegend'
import { Stage } from './Stage'

type SeatMapProps = {
  sector: SectorAvailability
  selection: SeatId[]
  onToggle: (seatId: SeatId) => void
}

type SeatChoice = Pick<SeatMapProps, 'selection' | 'onToggle'>

/** Si las filas no entran (a 360 px), el mapa se desliza dentro del panel y los asientos no se achican. */
export function SeatMap({ sector, selection, onToggle }: SeatMapProps) {
  return (
    <section aria-label={`Mapa de ${sector.sectorName}`} className="flex flex-col gap-5.5">
      <Stage />
      <div className="overflow-x-auto">
        <div className="flex min-w-130 flex-col gap-1.75">
          {groupSeatsByRow(sector.seats ?? []).map((seatRow) => (
            <SeatRowLine
              key={seatRow.row}
              seatRow={seatRow}
              selection={selection}
              onToggle={onToggle}
            />
          ))}
        </div>
      </div>
      <SeatLegend />
      <p className="text-center text-label text-subtle">
        Tocá un asiento verde para elegirlo y volvé a tocarlo para soltarlo.
      </p>
    </section>
  )
}

function SeatRowLine({ seatRow, ...choice }: SeatChoice & { seatRow: SeatRow }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <RowLabel row={seatRow.row} />
      {seatRow.seats.map((seat) => (
        <SeatButton key={seat.seatId} seat={seat} {...choice} />
      ))}
      <RowLabel row={seatRow.row} />
    </div>
  )
}

function RowLabel({ row }: { row: string }) {
  return (
    <span aria-hidden className="w-3.5 text-center font-mono text-xs text-subtle">
      {row}
    </span>
  )
}

/** El estado sale de `aria-pressed` y `disabled`, así el color nunca contradice lo que se anuncia. */
function SeatButton({ seat, selection, onToggle }: SeatChoice & { seat: SeatAvailability }) {
  const status = seatStatusOf(seat, selection)
  return (
    <button
      type="button"
      aria-label={formatSeatAccessibleName(seat, status)}
      aria-pressed={status === 'SELECTED'}
      disabled={status === 'TAKEN'}
      onClick={() => onToggle(seat.seatId)}
      className="size-7.5 shrink-0 cursor-pointer rounded-md border border-seat-free-line bg-seat-free p-0 font-mono text-micro text-seat-free-ink hover:border-ink disabled:cursor-not-allowed disabled:border-seat-taken disabled:bg-seat-taken disabled:text-seat-taken-ink aria-pressed:border-2 aria-pressed:border-ink aria-pressed:bg-accent aria-pressed:font-semibold aria-pressed:text-ink"
    >
      {seat.number}
    </button>
  )
}
