import type { EventDetail as EventDetailData } from '../../types/catalog.types'
import { EventHero } from './EventHero'

type EventDetailProps = { event: EventDetailData }

/** El detalle de un evento ya cargado: hero, aviso y "El evento". */
export function EventDetail({ event }: EventDetailProps) {
  return <EventHero event={event} />
}
