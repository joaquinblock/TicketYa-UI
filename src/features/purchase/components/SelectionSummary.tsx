import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { useId } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/atoms/Button'
import { ROUTES } from '@/shared/lib/routes'
import type { EventDetail } from '@/shared/types/event.types'
import { formatPrice } from '@/shared/utils/eventFormat'
import type {
  Reservation,
  SelectionSummary as Summary,
  ShownReservationError,
} from '../types/purchase.types'
import { formatReservationError } from '../utils/reservationFormat'
import { formatSelectionCount } from '../utils/seatFormat'

type SelectionSummaryProps = Pick<EventDetail, 'maxTicketsPerCustomer'> & {
  summary: Summary
  reservation: Reservation
}

/** "Tu selección": lo elegido con su precio, el total y el contador contra el límite por persona. */
export function SelectionSummary({
  summary,
  maxTicketsPerCustomer,
  reservation,
}: SelectionSummaryProps) {
  const titleId = useId()

  return (
    <aside
      aria-labelledby={titleId}
      className="flex min-w-0 flex-[1_1_300px] flex-col gap-3.5 rounded-2xl border border-line bg-surface p-5"
    >
      <div className="flex items-baseline justify-between border-b border-line pb-3.5">
        <h2 id={titleId} className="text-lg">
          Tu selección
        </h2>
        <span className="font-mono text-label text-subtle">
          {formatSelectionCount({ count: summary.count, maxTicketsPerCustomer })}
        </span>
      </div>
      <ul className="flex flex-col gap-2.5">
        {summary.lines.map((line) => (
          <li
            key={line.key}
            className="flex justify-between gap-2 border-b border-line pb-2.5 text-sm"
          >
            <span>{line.label}</span>
            <strong>{formatPrice(line.price)}</strong>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between">
        <span>Total</span>
        <strong className="font-mono text-2xl font-medium">{formatPrice(summary.total)}</strong>
      </div>
      {reservation.error && (
        <ReservationAlert
          error={reservation.error}
          maxTicketsPerCustomer={maxTicketsPerCustomer}
          onRetry={reservation.reserve}
        />
      )}
      <Button
        variant="accent"
        size="lg"
        disabled={summary.count === 0 || reservation.isReserving}
        onClick={reservation.reserve}
      >
        {reservation.isReserving ? (
          'Reservando…'
        ) : (
          <>
            Reservar y pagar
            <ArrowUpRight aria-hidden className="size-4.5" />
          </>
        )}
      </Button>
      <p className="flex gap-2 text-label text-subtle">
        <ShieldCheck aria-hidden className="mt-0.5 size-4 flex-none text-seat-free-ink" />
        Guardamos estos lugares 10 minutos mientras pagás.
      </p>
    </aside>
  )
}

type ReservationAlertProps = Pick<EventDetail, 'maxTicketsPerCustomer'> & {
  error: ShownReservationError
  /** Manda la misma clave: si el primer pedido llegó, el backend devuelve esa orden. */
  onRetry: () => void
}

/** Al lado del botón, para que se vea donde pasó (Nielsen 9), también en mobile. */
function ReservationAlert({ error, maxTicketsPerCustomer, onRetry }: ReservationAlertProps) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-1.5 rounded-control bg-error px-3.5 py-3 text-sm text-error-ink"
    >
      <p>{formatReservationError(error, maxTicketsPerCustomer)}</p>
      {error === 'UNAUTHORIZED' && (
        <Link to={ROUTES.login} className="font-semibold text-error-ink underline">
          Iniciar sesión (falta login)
        </Link>
      )}
      {error === 'FAILED' && (
        <Button variant="ghost" onClick={onRetry} className="self-start">
          Reintentar
        </Button>
      )}
    </div>
  )
}
