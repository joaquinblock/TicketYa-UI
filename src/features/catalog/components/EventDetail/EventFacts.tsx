import { CalendarDays, MapPin, Users, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { formatEventDateTime } from '../../lib/eventFormat'
import type { EventDetail } from '../../types/catalog.types'

type EventFactsProps = { event: EventDetail }

/** El aside "El evento": quiénes participan, cuándo abre la venta y dónde es. */
export function EventFacts({ event }: EventFactsProps) {
  return (
    <aside aria-labelledby="el-evento">
      <h2 id="el-evento">El evento</h2>
      <dl>
        <EventFact icon={Users} term="Participan">
          {event.participants.map((participant) => participant.name).join(', ')}
        </EventFact>
        <EventFact icon={CalendarDays} term="Venta desde">
          {formatEventDateTime(event.saleStart ?? '')}
        </EventFact>
        <EventFact icon={MapPin} term="Ubicación">
          {`${event.venue.name} · ${event.venue.address}, ${event.venue.city}`}
        </EventFact>
      </dl>
    </aside>
  )
}

type EventFactProps = { icon: LucideIcon; term: string; children: ReactNode }

function EventFact({ icon: Icon, term, children }: EventFactProps) {
  return (
    <div>
      <Icon aria-hidden />
      <dt>{term}</dt>
      <dd>{children}</dd>
    </div>
  )
}
