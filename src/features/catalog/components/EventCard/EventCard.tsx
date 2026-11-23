import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { ROUTES } from '@/shared/lib/routes'
import { EVENT_TYPE_LABEL } from '../../constants/catalog.constants'
import { formatPrice, getEventDateParts } from '../../lib/eventFormat'
import type { EventSummary } from '../../types/catalog.types'
import { EVENT_TYPE_BLOCK_CLASS } from './eventCard.constants'

type EventCardProps = { event: EventSummary }

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      to={ROUTES.event(event.id)}
      className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface text-ink no-underline transition hover:-translate-y-0.5 hover:text-ink hover:shadow-lg"
    >
      <EventCardCover event={event} />
      <EventCardBody event={event} />
    </Link>
  )
}

/** Bloque de color por tipo, hasta que el evento tenga imagen (#33). */
function EventCardCover({ event }: EventCardProps) {
  return (
    <div
      className={cn(
        'relative aspect-video',
        EVENT_TYPE_BLOCK_CLASS[event.type],
        event.status === 'SOLD_OUT' && 'grayscale',
      )}
    >
      <EventDateBlock dateTime={event.dateTime} />
      <EventStatusFlag event={event} />
    </div>
  )
}

function EventDateBlock({ dateTime }: Pick<EventSummary, 'dateTime'>) {
  const { day, month } = getEventDateParts(dateTime)
  return (
    <p className="absolute bottom-0 left-3 flex h-16 w-14 flex-col items-center justify-center rounded-t-lg bg-ink text-surface">
      <span className="text-micro font-semibold tracking-widest text-line-strong">{month}</span>
      <span className="font-display text-3xl leading-none font-extrabold">{day}</span>
    </p>
  )
}

const FLAG_CLASS = 'absolute top-3 right-3 rounded-md px-2 py-1.5 text-micro font-bold'

/** Agotado gana sobre alta demanda: ya no hay nada que apurar. */
function EventStatusFlag({ event }: EventCardProps) {
  if (event.status === 'SOLD_OUT')
    return <span className={cn(FLAG_CLASS, 'bg-surface text-muted')}>Agotado</span>
  if (event.highDemand)
    return <span className={cn(FLAG_CLASS, 'bg-accent text-ink')}>Alta demanda</span>
  return null
}

function EventCardBody({ event }: EventCardProps) {
  const { time } = getEventDateParts(event.dateTime)
  return (
    <div className="flex flex-1 flex-col gap-2 px-4 pt-4 pb-3.5">
      <p className="flex items-center gap-2 text-micro font-bold tracking-wider text-subtle uppercase">
        <span>{EVENT_TYPE_LABEL[event.type].singular}</span>
        <span aria-hidden className="size-0.75 rounded-full bg-line-strong" />
        <span>{time} HS</span>
      </p>
      <h3 className="text-xl leading-tight font-bold">{event.name}</h3>
      <p className="flex items-center gap-1.5 truncate text-label text-muted">
        <MapPin aria-hidden className="size-3.5 flex-none text-subtle" />
        {event.venue.name} <span className="text-subtle">· {event.venue.city}</span>
      </p>
      <p className="mt-auto flex items-baseline justify-end gap-1 border-t border-line pt-3 text-xs text-subtle">
        desde{' '}
        <span className="text-control font-bold text-ink">{formatPrice(event.priceFrom)}</span>
      </p>
    </div>
  )
}
