import { useEffect, useId } from 'react'
import { Button } from '@/shared/components/atoms/Button'

type ReturnRequestDialogProps = {
  eventName: string
  ticketLocation: string
  priceLabel: string
  isPending: boolean
  errorMessage: string | null
  onCancel: () => void
  onConfirm: () => void
}

export function ReturnRequestDialog({
  eventName,
  ticketLocation,
  priceLabel,
  isPending,
  errorMessage,
  onCancel,
  onConfirm,
}: ReturnRequestDialogProps) {
  const titleId = useId()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isPending) {
        onCancel()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isPending, onCancel])

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex w-115 max-w-full flex-col gap-3.5 rounded-2xl bg-surface p-7"
      >
        <h2 id={titleId} className="text-2xl font-bold text-ink">
          ¿Pedir la devolución?
        </h2>
        <p className="text-base font-medium text-ink">
          {eventName} · {ticketLocation}
        </p>
        <p className="text-sm leading-relaxed text-muted">
          Un administrador revisa el pedido. Si lo aprueba, liberamos el lugar y te reintegramos{' '}
          {priceLabel} al medio de pago original.
        </p>

        {errorMessage && (
          <p
            role="alert"
            className="rounded-control bg-error px-3.5 py-2.5 text-sm font-medium text-error-ink"
          >
            {errorMessage}
          </p>
        )}

        <div className="mt-1 flex flex-wrap justify-end gap-2.5">
          <Button type="button" variant="ghost" disabled={isPending} onClick={onCancel}>
            No, volver
          </Button>
          <Button type="button" variant="accent" disabled={isPending} onClick={onConfirm}>
            Sí, pedir devolución
          </Button>
        </div>
      </div>
    </div>
  )
}
