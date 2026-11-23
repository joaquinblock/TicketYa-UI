import type { EventDetail as EventDetailData } from '../../types/catalog.types'
import { EventFacts } from './EventFacts'
import { EventHero } from './EventHero'

type EventDetailProps = { event: EventDetailData }

/** El detalle de un evento ya cargado: hero, aviso y "El evento". */
export function EventDetail({ event }: EventDetailProps) {
  return (
    <>
      <EventHero event={event} />
      <EventFacts event={event} />
    </>
  )
}
