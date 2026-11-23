import { Calendar, MapPin } from 'lucide-react'
import { formatEventDateTime, formatPrice } from '@/shared/utils/eventFormat'
import type { Order } from '../types/payment.types'
import { summarizeOrderTickets } from '../utils/paymentFormat'

type OrderSummaryTicketProps = {
  order: Order
  photoUrl?: string | null
}

export function OrderSummaryTicket({ order, photoUrl }: OrderSummaryTicketProps) {
  const lines = summarizeOrderTickets(order.tickets)

  return (
    <aside
      aria-labelledby="orden-resumen"
      className="min-w-0 flex-[1_1_320px] overflow-hidden rounded-2xl border border-line bg-surface"
    >
      <div className="relative flex min-h-47.5 flex-col justify-end gap-1.5 bg-[#292823] p-5 text-surface">
        {photoUrl && (
          <img
            src={photoUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover"
          />
        )}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/30"
        />
        <span
          id="orden-resumen"
          className="relative text-micro font-bold tracking-[0.14em] text-line"
        >
          TICKETYA · ORDEN #{order.id}
        </span>
        <h2 className="relative text-2xl font-bold text-surface">{order.event.name}</h2>
        <span className="relative flex items-center gap-2 text-label text-surface/90">
          <Calendar aria-hidden className="size-3.75 flex-none" />
          {formatEventDateTime(order.event.dateTime)}
        </span>
        <span className="relative flex items-center gap-2 text-label text-surface/90">
          <MapPin aria-hidden className="size-3.75 flex-none" />
          {order.event.venueName} · {order.event.venueCity}
        </span>
      </div>

      <div aria-hidden className="relative mx-3.5 border-t-2 border-dashed border-line-strong">
        <span className="absolute -top-2.5 -left-6 size-4.5 rounded-full bg-background" />
        <span className="absolute -top-2.5 -right-6 size-4.5 rounded-full bg-background" />
      </div>

      <div className="flex flex-col gap-1 px-5 pt-4 pb-5">
        {lines.map((line) => (
          <div key={line.key} className="flex justify-between gap-2.5 py-1.5 text-sm text-muted">
            <span>{line.label}</span>
            <b className="text-ink">{formatPrice(line.subtotal)}</b>
          </div>
        ))}
        <div className="flex justify-between gap-2.5 py-1.5 text-sm text-muted">
          <span>Servicio de gestión</span>
          <b className="text-ink">Incluido</b>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2.5 border-t border-line pt-3.5 text-sm">
          <span className="text-control text-ink">Total</span>
          <b className="font-mono text-[22px] font-medium text-ink">{formatPrice(order.total)}</b>
        </div>
        <p className="mt-2 text-xs text-subtle">El QR aparece cuando se confirma el pago.</p>
      </div>
    </aside>
  )
}
