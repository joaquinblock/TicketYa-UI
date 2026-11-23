import { PageTitle } from '@/shared/components/atoms/PageTitle'
import { Skeleton } from '@/shared/components/atoms/Skeleton'
import type { EventDetail } from '@/shared/types/event.types'
import { formatEventHeader } from '../utils/seatFormat'

/** Mientras carga el evento, el eyebrow guarda su lugar para que el panel no salte al llegar. */
export function SeatsHeader({ event }: { event: EventDetail | undefined }) {
  return (
    <header className="flex flex-col gap-2">
      {event ? (
        <p className="text-micro font-bold tracking-widest text-subtle uppercase">
          {formatEventHeader(event)}
        </p>
      ) : (
        <Skeleton className="h-4 w-64 max-w-full rounded-sm" />
      )}
      <PageTitle>Elegí tus lugares</PageTitle>
    </header>
  )
}
