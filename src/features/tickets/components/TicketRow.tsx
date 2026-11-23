import { ChevronRight, Ticket as TicketIcon } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/shared/components/atoms/Badge'
import { PENDING_RETURN_TICKET_META, TICKET_STATUS_META } from '../constants/tickets.constants'
import { formatOrderPrice, formatTicketCode, formatTicketLocation } from '../lib/ticketFormat'
import type { Ticket } from '../types/tickets.types'
import { TicketQrCode } from './TicketQrCode'

type TicketRowProps = {
  ticket: Ticket
  canRequestReturn?: boolean
  onRequestReturn?: (ticket: Ticket) => void
}

export function TicketRow({ ticket, canRequestReturn = true, onRequestReturn }: TicketRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const code = formatTicketCode(ticket.id)
  const isPendingReturn = ticket.status === 'ISSUED' && Boolean(ticket.hasPendingReturnRequest)
  const canShowReturnAction = ticket.status === 'ISSUED' && !isPendingReturn
  const statusMeta = isPendingReturn
    ? PENDING_RETURN_TICKET_META
    : TICKET_STATUS_META[ticket.status]
  const isActive = ticket.status === 'ISSUED' && !isPendingReturn

  return (
    <div className="border-t border-line first:border-t-0">
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`flex min-h-18 w-full cursor-pointer items-center gap-3.5 px-4 py-3 text-left text-ink transition-colors md:px-5.5 ${
          isExpanded ? 'bg-warning/30' : 'bg-surface hover:bg-surface-hover'
        }`}
      >
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-control bg-background"
        >
          <TicketIcon className="size-5 text-ink" strokeWidth={1.8} />
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <strong className="text-control font-semibold">{formatTicketLocation(ticket)}</strong>
          <span className="text-label text-subtle">
            Entrada <span className="font-mono">#{code}</span> ·{' '}
            <span>{formatOrderPrice(ticket.price)}</span>
          </span>
        </span>

        <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
        <ChevronRight
          aria-hidden="true"
          className={`size-4.5 shrink-0 transition-transform ${
            isExpanded ? 'rotate-90 text-ink' : 'text-subtle'
          }`}
        />
      </button>

      {isExpanded && (
        <div className="flex flex-wrap items-center gap-6 border-t border-dashed border-line-strong bg-warning/30 px-4 py-5.5 md:px-5.5">
          <TicketQrCode qrValue={ticket.qrCode} code={code} isActive={isActive} />
          <div className="flex min-w-60 flex-1 flex-col items-start gap-2.5">
            <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
            <h3 className="text-xl font-bold text-ink">{statusMeta.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{statusMeta.description}</p>
            {canShowReturnAction && (
              <button
                type="button"
                disabled={!canRequestReturn}
                onClick={() => onRequestReturn?.(ticket)}
                className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 text-sm font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 disabled:cursor-not-allowed disabled:text-subtle disabled:decoration-line-strong"
              >
                {canRequestReturn ? 'Pedir la devolución ↗' : 'Pedir la devolución'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
