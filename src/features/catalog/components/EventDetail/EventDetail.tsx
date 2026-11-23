import type { EventDetail as EventDetailData } from '../../types/catalog.types'
import { EventSectors } from '../EventSectors/EventSectors'
import { EventFacts } from './EventFacts'
import { EventHero } from './EventHero'
import { EventNotice } from './EventNotice'

type EventDetailProps = { event: EventDetailData }

/**
 * El detalle de un evento ya cargado: hero, aviso, sectores y "El evento". A 360 px el aside pasa
 * debajo de la columna principal.
 */
export function EventDetail({ event }: EventDetailProps) {
  return (
    <div className="flex flex-col gap-8">
      <EventHero event={event} />
      <div className="flex flex-wrap items-start gap-8">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
          <EventNotice event={event} />
          <EventSectors event={event} />
        </div>
        <EventFacts event={event} />
      </div>
    </div>
  )
}
