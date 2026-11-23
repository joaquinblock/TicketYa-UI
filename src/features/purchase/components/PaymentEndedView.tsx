import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/routes'

type PaymentEndedViewProps = {
  orderId?: number
  eventId: string
  title: string
  description: string
}

export function PaymentEndedView({ orderId, eventId, title, description }: PaymentEndedViewProps) {
  return (
    <section
      aria-labelledby="pago-finalizado"
      className="mx-auto my-6 flex max-w-160 flex-col items-start gap-3.5 rounded-2xl border border-line bg-surface p-6 md:p-9"
    >
      {orderId != null && (
        <span className="text-micro font-bold tracking-[0.14em] text-subtle uppercase">
          Orden #{orderId}
        </span>
      )}
      <h1 id="pago-finalizado" className="text-[28px] md:text-[32px]">
        {title}
      </h1>
      <p className="m-0 text-base leading-relaxed text-muted">{description}</p>
      <Link
        to={ROUTES.seats(eventId)}
        className="inline-flex min-h-13.5 items-center justify-center rounded-xl bg-accent px-6 text-base font-bold text-ink no-underline hover:bg-accent-hover hover:text-ink"
      >
        Elegir lugares de nuevo
      </Link>
    </section>
  )
}
