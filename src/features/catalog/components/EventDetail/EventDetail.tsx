import type { EventDetail as EventDetailData } from '../../types/catalog.types'
import { EventFacts } from './EventFacts'
import { EventHero } from './EventHero'
import { EventNotice } from './EventNotice'

type EventDetailProps = { event: EventDetailData }

/** El detalle de un evento ya cargado: hero, aviso y "El evento". La story 16 suma los sectores debajo del aviso. */
export function EventDetail({ event }: EventDetailProps) {
  return (
    <>
      <EventHero event={event} />
      <div>
        <div>
          <EventNotice event={event} />
        </div>
        <EventFacts event={event} />
      </div>
    </>
  )
}
