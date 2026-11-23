import { useId } from 'react'
import type { AlertMessage } from '../types/purchase.types'

/** Avisa que la elección cambió sola con un refresco: la primera oración se destaca. */
export function SelectionChangedAlert({ message }: { message: AlertMessage }) {
  const leadId = useId()

  return (
    <div
      ref={takeFocusIfLost}
      role="alert"
      aria-labelledby={leadId}
      tabIndex={-1}
      className="rounded-control bg-error px-3.5 py-3 text-sm text-error-ink"
    >
      <strong id={leadId}>{message.lead}</strong> {message.hint}
    </div>
  )
}

/**
 * Lo que tenía el foco (un asiento ocupado, un botón de cantidad) queda deshabilitado y el
 * navegador lo manda al `body`: el aviso lo toma para que el próximo Tab siga desde el panel y no
 * desde el principio de la página.
 */
function takeFocusIfLost(alert: HTMLDivElement | null) {
  const focused = document.activeElement
  if (alert && (focused === document.body || focused?.matches(':disabled'))) alert.focus()
}
