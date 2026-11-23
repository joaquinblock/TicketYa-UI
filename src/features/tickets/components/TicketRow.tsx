import { ChevronRight, Ticket as TicketIcon } from 'lucide-react'
import { Badge } from '@/shared/components/atoms/Badge'
import { TICKET_STATUS_META } from '../constants/tickets.constants'
import { formatOrderPrice, formatTicketCode, formatTicketLocation } from '../lib/ticketFormat'
import type { Ticket } from '../types/tickets.types'

type TicketRowProps = {
  ticket: Ticket
}

export function TicketRow({ ticket }: TicketRowProps) {
  const code = formatTicketCode(ticket.id)
  const statusMeta = TICKET_STATUS_META[ticket.status]

  return (
    <div className="border-t border-line first:border-t-0">
      <button
        type="button"
        aria-expanded={false}
        className="flex min-h-18 w-full cursor-pointer items-center gap-3.5 bg-surface px-4 py-3 text-left text-ink transition-colors hover:bg-surface-hover md:px-5.5"
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
        <ChevronRight aria-hidden="true" className="size-4.5 shrink-0 text-subtle" />
      </button>
    </div>
  )
}
