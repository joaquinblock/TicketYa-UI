import type { EventDetail as EventDetailData } from '../../types/catalog.types'
import { EventFacts } from './EventFacts'
import { EventHero } from './EventHero'
import { EventNotice } from './EventNotice'

type EventDetailProps = { event: EventDetailData }

/**
 * El detalle de un evento ya cargado: hero, aviso y "El evento". La story 16 suma los sectores
 * debajo del aviso. A 360 px el aside pasa debajo de la columna principal.
 */
export function EventDetail({ event }: EventDetailProps) {
  return (
    <div className="flex flex-col gap-8">
      <EventHero event={event} />
      <div className="flex flex-wrap items-start gap-8">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
          <EventNotice event={event} />
        </div>
        <EventFacts event={event} />
      </div>
    </div>
  )
}
