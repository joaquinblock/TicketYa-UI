import { CircleAlert, X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { ADMIN_EVENT_ACTION_META } from '../../constants/adminEvents.constants'
import type { AdminEvent, AdminEventAction } from '../../types/adminEvent.types'

type AdminEventActionDialogProps = {
  event: AdminEvent
  action: AdminEventAction
  cancelConfirmation: string
  onCancelConfirmationChange: (value: string) => void
  canConfirm: boolean
  isRunning: boolean
  error: string | undefined
  onConfirm: () => void
  onClose: () => void
}

/**
 * `.bo-modal` del diseño. Cancelar es definitivo y reintegra todas las entradas: se confirma
 * escribiendo el nombre del evento (Nielsen 5).
 */
export function AdminEventActionDialog({
  event,
  action,
  cancelConfirmation,
  onCancelConfirmationChange,
  canConfirm,
  isRunning,
  error,
  onConfirm,
  onClose,
}: AdminEventActionDialogProps) {
  const meta = ADMIN_EVENT_ACTION_META[action]

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-60 grid place-items-center bg-[#15141061] px-3"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-event-action-title"
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
        <h2 id="admin-event-action-title" className="m-0 mb-2 font-display text-lg font-bold">
          {meta.title}
        </h2>
        <p className="m-0 mb-4 text-xs leading-[1.6] text-[#5f5c55]">{meta.message(event)}</p>

        {action === 'cancel' && (
          <label className="mb-4 flex flex-col gap-1.5 text-[11px] font-semibold">
            Escribí el nombre del evento para confirmar
            <input
              value={cancelConfirmation}
              onChange={(changeEvent) => onCancelConfirmationChange(changeEvent.target.value)}
              placeholder={event.name}
              className="min-h-10 rounded-[7px] border border-[#dedbd3] px-2.5 text-xs font-normal"
            />
          </label>
        )}

        {error && (
          <p role="alert" className="m-0 mb-3 text-[11px] font-medium text-error-ink">
            {error}
          </p>
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
              meta.isDestructive
                ? 'border-[#b83224] bg-[#b83224] text-white'
                : 'border-accent bg-accent text-[#171717] hover:bg-[#f0b714]',
            )}
          >
            {isRunning ? 'Aplicando…' : meta.label}
          </button>
        </div>
      </section>
    </div>
  )
}
