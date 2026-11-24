import { type RefObject, useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), select:not([disabled]), [href], iframe, [tabindex]:not([tabindex="-1"])'

type UseDialogFocusVariables = {
  dialogRef: RefObject<HTMLElement | null>
  isOpen: boolean
  onClose: () => void
}

/**
 * Mientras el modal está abierto: el foco entra al abrirse, Tab no sale del modal, Escape lo
 * cierra y, al cerrarse, el foco vuelve al botón que lo abrió (Nielsen 3).
 */
export function useDialogFocus({ dialogRef, isOpen, onClose }: UseDialogFocusVariables) {
  // El último onClose, sin volver a montar el efecto: si no, el foco saltaría en cada render.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!isOpen) return
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    focusableElementsOf(dialogRef.current)[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
      if (event.key === 'Tab') keepFocusInside(event, dialogRef.current)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      opener?.focus()
    }
  }, [dialogRef, isOpen])
}

function focusableElementsOf(container: HTMLElement | null): HTMLElement[] {
  return container ? [...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)] : []
}

function keepFocusInside(event: KeyboardEvent, container: HTMLElement | null) {
  const focusable = focusableElementsOf(container)
  const first = focusable[0]
  const last = focusable.at(-1)
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}
