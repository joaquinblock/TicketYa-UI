import { CalendarDays, ExternalLink, MapPin, Users, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/shared/components/atoms/Button'
import { formatEventDateTime } from '@/shared/utils/eventFormat'
import { getVenueMapUrl } from '../../lib/venueMap'
import type { EventDetail } from '@/shared/types/event.types'

type EventFactsProps = { event: EventDetail }

/** El aside "El evento": quiénes participan, cuándo abre la venta y dónde es. */
export function EventFacts({ event }: EventFactsProps) {
  return (
    <aside
      aria-labelledby="el-evento"
      className="flex min-w-0 flex-[1_1_300px] flex-col rounded-card border border-line bg-surface p-5"
    >
      <h2 id="el-evento" className="mb-3.5 text-xl">
        El evento
      </h2>
      <dl>
        {event.participants.length > 0 && (
          <EventFact icon={Users} term="Participan">
            {event.participants.map((participant) => participant.name).join(', ')}
          </EventFact>
        )}
        {event.saleStart && (
          <EventFact icon={CalendarDays} term="Venta desde">
            {formatEventDateTime(event.saleStart)}
          </EventFact>
        )}
        <EventFact icon={MapPin} term="Ubicación">
          {`${event.venue.name} · ${event.venue.address}, ${event.venue.city}`}
        </EventFact>
      </dl>
      <Button variant="ghost" asChild className="mt-3">
        <a href={getVenueMapUrl(event.venue)} target="_blank" rel="noopener noreferrer">
          Ver en el mapa
          <ExternalLink aria-hidden className="size-4" />
          <span className="sr-only"> (abre en otra pestaña)</span>
        </a>
      </Button>
    </aside>
  )
}

type EventFactProps = { icon: LucideIcon; term: string; children: ReactNode }

function EventFact({ icon: Icon, term, children }: EventFactProps) {
  return (
    <div className="border-t border-line py-3.25">
      <dt className="flex items-center gap-3 text-sm font-bold">
        <Icon aria-hidden className="size-5 flex-none text-subtle" />
        {term}
      </dt>
      <dd className="mt-1 pl-8 text-label leading-snug text-subtle">{children}</dd>
    </div>
  )
}
