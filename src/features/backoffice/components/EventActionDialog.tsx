import { CircleAlert, X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

type EventActionDialogProps = {
  eventName: string
  title: string
  message: string
  confirmLabel: string
  isDestructive: boolean
  /** Para lo definitivo (cancelar, borrar): se confirma escribiendo el nombre del evento. */
  requiresNameConfirmation: boolean
  nameConfirmation: string
  onNameConfirmationChange: (value: string) => void
  canConfirm: boolean
  isRunning: boolean
  error: string | undefined
  /** Lo que el backend dice que falta, por ejemplo al publicar un borrador incompleto. */
  errorDetails?: readonly string[]
  onConfirm: () => void
  onClose: () => void
}

/**
 * `.bo-modal` del diseño, para cambiar el estado de un evento. Lo que no se puede deshacer se
 * confirma escribiendo el nombre del evento (Nielsen 5).
 */
export function EventActionDialog({
  eventName,
  title,
  message,
  confirmLabel,
  isDestructive,
  requiresNameConfirmation,
  nameConfirmation,
  onNameConfirmationChange,
  canConfirm,
  isRunning,
  error,
  errorDetails = [],
  onConfirm,
  onClose,
}: EventActionDialogProps) {
  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-60 grid place-items-center bg-[#15141061] px-3"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-action-title"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        className="relative w-full max-w-105 rounded-xl bg-surface p-6 text-[13px] shadow-[0_20px_60px_#0003]"
      >
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute top-3 right-3 grid size-11 cursor-pointer place-items-center border-0 bg-transparent"
        >
          <X aria-hidden className="size-4.5" />
        </button>
        <div className="mb-3 grid size-10 place-items-center rounded-full bg-[#ffedeb] text-[#b93e32]">
          <CircleAlert aria-hidden className="size-5" />
        </div>
        <h2 id="event-action-title" className="m-0 mb-2 font-display text-lg font-bold">
          {title}
        </h2>
        <p className="m-0 mb-4 text-xs leading-[1.6] text-[#5f5c55]">{message}</p>

        {requiresNameConfirmation && (
          <label className="mb-4 flex flex-col gap-1.5 text-[11px] font-semibold">
            Escribí el nombre del evento para confirmar
            <input
              value={nameConfirmation}
              onChange={(changeEvent) => onNameConfirmationChange(changeEvent.target.value)}
              placeholder={eventName}
              className="min-h-10 rounded-[7px] border border-[#dedbd3] px-2.5 text-xs font-normal"
            />
          </label>
        )}

        {error && (
          <div role="alert" className="mb-3 text-[11px] font-medium text-error-ink">
            <p className="m-0">{error}</p>
            {errorDetails.length > 0 && (
              <ul className="m-0 mt-1.5 list-disc pl-4.5 font-normal">
                {errorDetails.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 cursor-pointer items-center rounded-[7px] border border-[#dedbd3] bg-surface px-3.25 text-[11px] font-semibold hover:bg-[#f7f6f2]"
          >
            Volver
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm}
            className={cn(
              'inline-flex min-h-10 cursor-pointer items-center rounded-[7px] border px-3.25 text-[11px] font-semibold disabled:cursor-not-allowed disabled:opacity-45',
              isDestructive
                ? 'border-[#b83224] bg-[#b83224] text-white'
                : 'border-accent bg-accent text-[#171717] hover:bg-[#f0b714]',
            )}
          >
            {isRunning ? 'Aplicando…' : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
