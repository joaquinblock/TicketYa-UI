import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/atoms/Button'
import { ROUTES } from '@/shared/lib/routes'
import { formatEventDateTime, formatPrice } from '@/shared/utils/eventFormat'
import { useFeaturedEvent } from '../../hooks/useFeaturedEvent'

export function FeaturedEventCard() {
  const { event, countdown } = useFeaturedEvent()

  if (!event) return null

  const eyebrowLabel = countdown ? 'Sale a la venta' : 'Próximo evento'
  const timerLabel = event.highDemand
    ? 'Tiempo para que abra la fila'
    : 'Tiempo para que abra la venta'

  return (
    <aside
      aria-labelledby="featured-event-title"
      className="w-85 max-w-full flex-1 basis-75 overflow-hidden rounded-2xl bg-surface text-ink shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:rotate-[1.5deg]"
    >
      <div className="relative h-32.5 overflow-hidden bg-line">
        {event.photoUrl && (
          <img src={event.photoUrl} alt={event.name} className="block size-full object-cover" />
        )}
        {event.highDemand && (
          <span className="absolute top-2.75 right-2.75 rounded-[5px] bg-accent px-2.25 py-1.5 text-[11px] font-bold text-ink">
            Alta demanda
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 px-5 pt-4.5 pb-4">
        <span className="flex items-center gap-2 text-micro font-bold tracking-[0.14em] text-subtle uppercase">
          <span aria-hidden className="inline-block h-0.5 w-4.75 bg-accent" />
          {eyebrowLabel}
        </span>
        <h2 id="featured-event-title" className="text-2xl">
          {event.name}
        </h2>
        <span className="text-sm text-muted">
          {formatEventDateTime(event.dateTime)} · {event.venue.name}
        </span>
      </div>

      <div aria-hidden className="relative mx-3.5 border-t-2 border-dashed border-line-strong">
        <span className="absolute -top-2.5 -left-6 size-4.5 rounded-full bg-ink" />
        <span className="absolute -top-2.5 -right-6 size-4.5 rounded-full bg-ink" />
      </div>

      <div className="flex flex-col gap-3 px-5 pt-4 pb-5">
        {countdown ? (
          <>
            <span className="text-[13px] font-semibold text-muted">
              {event.highDemand ? 'La fila virtual abre en' : 'La venta abre en'}
            </span>
            <div
              role="timer"
              aria-label={timerLabel}
              className="flex items-baseline gap-1.5 font-mono"
            >
              <span className="rounded-md bg-ink px-2 py-1.5 text-[22px] font-medium text-surface">
                {countdown.hh}
              </span>
              <span>:</span>
              <span className="rounded-md bg-ink px-2 py-1.5 text-[22px] font-medium text-surface">
                {countdown.mm}
              </span>
              <span>:</span>
              <span className="rounded-md bg-ink px-2 py-1.5 text-[22px] font-medium text-surface">
                {countdown.ss}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[13px] font-semibold text-muted">Entradas desde</span>
            <strong className="font-mono text-xl font-medium">
              {formatPrice(event.priceFrom)}
            </strong>
          </div>
        )}

        <Button asChild variant="primary" className="w-full">
          <Link to={ROUTES.event(event.id)}>Ver el evento</Link>
        </Button>
      </div>
    </aside>
  )
}
