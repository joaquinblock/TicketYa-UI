import { CalendarDays, MapPin } from 'lucide-react'
import { Badge } from '@/shared/components/atoms/Badge'
import { cn } from '@/shared/lib/cn'
import { EVENT_TYPE_LABEL, HIGH_DEMAND_LABEL } from '../../constants/catalog.constants'
import { formatEventDateTime } from '@/shared/utils/eventFormat'
import type { EventDetail } from '@/shared/types/event.types'
import type { OffSaleStatus } from '../../types/catalog.types'
import { EVENT_TYPE_BLOCK_CLASS } from '../EventCard/eventCard.constants'
import { STATUS_BADGE } from './eventDetail.constants'

type EventHeroProps = { event: EventDetail }

/** El bloque de color del tipo ocupa el lugar de la foto (#33), con la misma sombra del mockup para leer el texto. */
export function EventHero({ event }: EventHeroProps) {
  return (
    <section
      aria-labelledby="evento-titulo"
      className={cn(
        'relative isolate flex min-h-105 items-end overflow-hidden rounded-2xl text-surface',
        EVENT_TYPE_BLOCK_CLASS[event.type],
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-r from-ink/90 via-ink/70 to-ink/20"
      />
      <span aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-ink/60 to-ink/0" />
      <div className="flex max-w-180 flex-col gap-3.5 px-5 pt-16 pb-7 md:px-16 md:pb-10">
        <EventBadges event={event} />
        <h1 id="evento-titulo" className="text-[clamp(40px,6vw,64px)] leading-[0.98]">
          {event.name}
        </h1>
        {event.description && (
          <p className="max-w-145 leading-relaxed text-surface/90">{event.description}</p>
        )}
        <div className="flex flex-wrap gap-x-6 gap-y-2.5 text-sm font-semibold">
          <p className="flex items-center gap-2">
            <CalendarDays aria-hidden className="size-4.5 flex-none" />
            <span>{formatEventDateTime(event.dateTime)}</span>
          </p>
          <p className="flex items-center gap-2">
            <MapPin aria-hidden className="size-4.5 flex-none" />
            <span>{`${event.venue.name} · ${event.venue.city}`}</span>
          </p>
        </div>
      </div>
    </section>
  )
}

/** Si el evento no está a la venta, el badge del estado es lo único destacado: alta demanda pasa a secundario. */
function EventBadges({ event }: EventHeroProps) {
  const isOnSale = event.status === 'PUBLISHED'

  return (
    <ul aria-label="Etiquetas del evento" className="flex flex-wrap gap-2">
      <li>
        <Badge>{EVENT_TYPE_LABEL[event.type].singular}</Badge>
      </li>
      {event.highDemand && (
        <li>
          <Badge tone={isOnSale ? 'accent' : 'outline'}>{HIGH_DEMAND_LABEL}</Badge>
        </li>
      )}
      {event.status !== 'PUBLISHED' && (
        <li>
          <StatusBadgeItem status={event.status} />
        </li>
      )}
    </ul>
  )
}

function StatusBadgeItem({ status }: { status: OffSaleStatus }) {
  const { label, tone } = STATUS_BADGE[status]
  return <Badge tone={tone}>{label}</Badge>
}
