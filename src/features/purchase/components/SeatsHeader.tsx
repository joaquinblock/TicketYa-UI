import { PageTitle } from '@/shared/components/atoms/PageTitle'
import type { EventDetail } from '@/shared/types/event.types'
import { formatEventHeader } from '../utils/seatFormat'

/** Sin el evento cargado queda solo el título: el resto de la página no depende de él. */
export function SeatsHeader({ event }: { event: EventDetail | undefined }) {
  return (
    <header className="flex flex-col gap-2">
      {event && (
        <p className="text-micro font-bold tracking-widest text-subtle uppercase">
          {formatEventHeader(event)}
        </p>
      )}
      <PageTitle>Elegí tus lugares</PageTitle>
    </header>
  )
}
