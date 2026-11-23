import { TicketX } from 'lucide-react'
import { useId } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/atoms/Button'
import { ROUTES } from '@/shared/lib/routes'

/** Reintentar no lo arregla: en vez de eso, una salida al evento. */
export function SeatsNotForSale({ eventId }: { eventId: string }) {
  const titleId = useId()
  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col items-center gap-2.5 rounded-card border border-line bg-surface px-5 py-12 text-center text-subtle"
    >
      <TicketX aria-hidden className="size-11 text-line-strong" />
      <h2 id={titleId} className="text-2xl text-ink">
        Este evento no tiene lugares a la venta
      </h2>
      <p>Mirá el evento para ver cuándo abre la venta o si cambió algo.</p>
      <Button asChild variant="ghost" className="mt-2">
        <Link to={ROUTES.event(eventId)}>Ver el evento</Link>
      </Button>
    </section>
  )
}
