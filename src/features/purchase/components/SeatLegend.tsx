import { SEAT_STATUS_LABEL, SEAT_STATUSES } from '../constants/seats.constants'
import type { SeatStatus } from '../types/purchase.types'

/** El mismo color y borde que cada asiento: el elegido se distingue también por el borde. */
const SEAT_SWATCH_CLASS = {
  AVAILABLE: 'border border-seat-free-line bg-seat-free',
  TAKEN: 'bg-seat-taken',
  SELECTED: 'border-2 border-ink bg-accent',
} as const satisfies Record<SeatStatus, string>

export function SeatLegend() {
  return (
    <ul className="flex flex-wrap justify-center gap-5.5 text-label text-muted">
      {SEAT_STATUSES.map((status) => (
        <li key={status} className="flex items-center gap-1.75">
          <span
            aria-hidden
            className={`inline-block size-3.5 rounded ${SEAT_SWATCH_CLASS[status]}`}
          />
          {SEAT_STATUS_LABEL[status]}
        </li>
      ))}
    </ul>
  )
}
