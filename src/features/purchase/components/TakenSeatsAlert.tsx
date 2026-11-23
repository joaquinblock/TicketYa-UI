import { useId } from 'react'
import type { SeatAvailability } from '@/shared/types/event.types'
import { formatTakenSeatsMessage } from '../utils/seatFormat'

/** Un solo aviso por refresco, que nombra todos los asientos que se perdieron. */
export function TakenSeatsAlert({ seats }: { seats: SeatAvailability[] }) {
  const leadId = useId()
  const { lead, hint } = formatTakenSeatsMessage(seats)

  return (
    <div
      ref={takeFocusIfLost}
      role="alert"
      aria-labelledby={leadId}
      tabIndex={-1}
      className="rounded-control bg-error px-3.5 py-3 text-sm text-error-ink"
    >
      <strong id={leadId}>{lead}</strong> {hint}
    </div>
  )
}

/**
 * El asiento ocupado queda deshabilitado y, si tenía el foco, el navegador lo manda al `body`:
 * el aviso lo toma para que el próximo Tab siga desde el mapa y no desde el principio de la página.
 */
function takeFocusIfLost(alert: HTMLDivElement | null) {
  const focused = document.activeElement
  if (alert && (focused === document.body || focused?.matches(':disabled'))) alert.focus()
}
