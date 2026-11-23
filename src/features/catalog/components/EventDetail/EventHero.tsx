import { CalendarDays, MapPin } from 'lucide-react'
import { Badge } from '@/shared/components/atoms/Badge'
import { EVENT_TYPE_LABEL, HIGH_DEMAND_LABEL } from '../../constants/catalog.constants'
import { formatEventDateTime } from '../../lib/eventFormat'
import type { EventDetail } from '../../types/catalog.types'

type EventHeroProps = { event: EventDetail }

export function EventHero({ event }: EventHeroProps) {
  return (
    <section aria-labelledby="evento-titulo">
      <EventBadges event={event} />
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

function EventBadges({ event }: EventHeroProps) {
  return (
    <ul aria-label="Etiquetas del evento">
      <li>
        <Badge>{EVENT_TYPE_LABEL[event.type].singular}</Badge>
      </li>
      {event.highDemand && (
        <li>
          <Badge>{HIGH_DEMAND_LABEL}</Badge>
        </li>
      )}
    </ul>
  )
}
