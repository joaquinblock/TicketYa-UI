import { useId } from 'react'
import type { SeatAvailability } from '@/shared/types/event.types'
import { formatTakenSeatsMessage } from '../utils/seatFormat'

/** Un solo aviso por refresco, que nombra todos los asientos que se perdieron. */
export function TakenSeatsAlert({ seats }: { seats: SeatAvailability[] }) {
  const leadId = useId()
  const { lead, hint } = formatTakenSeatsMessage(seats)

  return (
    <div
      role="alert"
      aria-labelledby={leadId}
      className="rounded-control bg-error px-4 py-3 text-sm text-error-ink"
    >
      <strong id={leadId}>{lead}</strong> {hint}
    </div>
  )
}
