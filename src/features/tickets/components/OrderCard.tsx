import { CreditCard, MapPin } from 'lucide-react'
import { PAYMENT_METHOD_LABEL } from '../constants/tickets.constants'
import {
  formatOrderPrice,
  getOrderEventDateParts,
  isWithinReturnDeadline,
} from '../lib/ticketFormat'
import type { Order, Ticket } from '../types/tickets.types'
import { TicketRow } from './TicketRow'

type OrderCardProps = {
  order: Order
  onRequestReturn?: (order: Order, ticket: Ticket) => void
}

export function OrderCard({ order, onRequestReturn }: OrderCardProps) {
  const { day, month, weekday, time } = getOrderEventDateParts(order.event.dateTime)
  const canRequestReturn = isWithinReturnDeadline(order.event.dateTime)
  const paymentLabel = order.paymentMethod
    ? PAYMENT_METHOD_LABEL[order.paymentMethod]
    : 'Pago confirmado'

  return (
    <article
      aria-label={`Orden ${order.id}, ${order.event.name}`}
      className="overflow-hidden rounded-2xl border border-line bg-surface"
    >
      <div className="flex items-center gap-4 px-4 py-5 md:gap-4.5 md:px-5.5">
        <div
          aria-hidden="true"
          className="flex h-17 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-ink text-surface"
        >
          <b className="font-display text-2xl leading-none font-extrabold">{day}</b>
          <span className="mt-1 text-micro font-bold tracking-widest">{month}</span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-micro font-bold tracking-widest text-subtle uppercase">
            {weekday} · {time}
          </span>
          <h2 className="text-xl leading-snug font-bold text-ink">{order.event.name}</h2>
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
            {order.event.venueName} · {order.event.venueCity}
          </span>
        </div>

        <span className="hidden font-mono text-xs font-medium tracking-wider text-subtle md:inline">
          ORDEN #{order.id}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4.5 gap-y-1.5 border-y border-line bg-footer px-4 py-3 text-label text-muted md:px-5.5">
        <span className="inline-flex items-center gap-1.5">
          <CreditCard aria-hidden="true" className="size-3.5 shrink-0" />
          {paymentLabel}
        </span>
        <span>
          Total <strong className="ml-1 text-ink">{formatOrderPrice(order.total)}</strong>
        </span>
      </div>

      {!canRequestReturn && (
        <div className="border-b border-line bg-warning px-4 py-2.5 text-label text-warning-ink md:px-5.5">
          Faltan menos de 72 horas para este evento: ya no se pueden pedir devoluciones.
        </div>
      )}

      <div>
        {order.tickets.map((ticket) => (
          <TicketRow
            key={ticket.id}
            ticket={ticket}
            canRequestReturn={canRequestReturn}
            onRequestReturn={
              onRequestReturn ? (selected) => onRequestReturn(order, selected) : undefined
            }
          />
        ))}
      </div>
    </article>
  )
}
