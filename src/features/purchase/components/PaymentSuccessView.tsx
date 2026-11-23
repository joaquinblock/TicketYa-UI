import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/routes'
import { formatPrice } from '@/shared/utils/eventFormat'
import { PAYMENT_METHOD_META } from '../constants/payment.constants'
import type { Order } from '../types/payment.types'

type PaymentSuccessViewProps = {
  order: Order
}

export function PaymentSuccessView({ order }: PaymentSuccessViewProps) {
  const methodLabel = order.paymentMethod
    ? PAYMENT_METHOD_META[order.paymentMethod].label.toLowerCase()
    : 'tu medio elegido'
  const ticketCount = order.tickets.length
  const qrLabel = ticketCount === 1 ? 'el código QR' : `los ${ticketCount} códigos QR`

  return (
    <section
      aria-labelledby="pago-confirmado"
      className="mx-auto my-8 flex max-w-150 flex-col items-center gap-4 text-center"
    >
      <span
        aria-hidden
        className="grid size-18 place-items-center rounded-full bg-success text-success-ink"
      >
        <Check className="size-8.5" strokeWidth={2.5} />
      </span>
      <span className="text-micro font-bold tracking-[0.14em] text-subtle uppercase">
        Orden #{order.id} · pago aprobado
      </span>
      <h1
        id="pago-confirmado"
        className="text-[clamp(38px,5vw,54px)] leading-none tracking-[-0.04em]"
      >
        ¡Listo! Ya tenés tus entradas<span className="text-accent">.</span>
      </h1>
      <p className="m-0 leading-relaxed text-muted">
        Pagaste {formatPrice(order.total)} con {methodLabel}. Ya emitimos {qrLabel} en tu cuenta.
        Cada uno sirve para entrar una sola vez.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2.5">
        <Link
          to={ROUTES.myTickets}
          className="inline-flex min-h-13.5 items-center justify-center rounded-xl bg-accent px-7 text-base font-bold text-ink no-underline hover:bg-accent-hover hover:text-ink"
        >
          Ver mis entradas
        </Link>
        <Link
          to={ROUTES.home}
          className="inline-flex min-h-13.5 items-center justify-center rounded-xl border border-line-strong bg-surface px-5 text-control font-semibold text-ink no-underline hover:bg-surface-hover hover:text-ink"
        >
          Seguir explorando
        </Link>
      </div>
    </section>
  )
}
