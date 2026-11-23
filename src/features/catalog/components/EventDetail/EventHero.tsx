import { CalendarDays, MapPin } from 'lucide-react'
import { EVENT_TYPE_LABEL } from '../../constants/catalog.constants'
import { formatEventDateTime } from '../../lib/eventFormat'
import type { EventDetail } from '../../types/catalog.types'

type EventHeroProps = { event: EventDetail }

export function EventHero({ event }: EventHeroProps) {
  return (
    <section aria-labelledby="evento-titulo">
      <p>{EVENT_TYPE_LABEL[event.type].singular}</p>
      <h1 id="evento-titulo">{event.name}</h1>
      {event.description && <p>{event.description}</p>}
      <p>
        <CalendarDays aria-hidden />
        <span>{formatEventDateTime(event.dateTime)}</span>
      </p>
      <p>
        <MapPin aria-hidden />
        <span>{`${event.venue.name} · ${event.venue.city}`}</span>
      </p>
    </section>
  )
}
