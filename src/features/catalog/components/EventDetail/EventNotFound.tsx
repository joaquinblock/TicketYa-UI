import { CalendarX2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/atoms/Button'
import { ROUTES } from '@/shared/lib/routes'

/** Sin evento no hay compra: sin los pasos, con un solo "Volver a explorar". */
export function EventNotFound() {
  return (
    <section
      aria-labelledby="evento-no-encontrado"
      className="mx-auto flex w-full max-w-310 flex-col items-center gap-2.5 px-4 py-16 text-center text-subtle md:px-7"
    >
      <CalendarX2 aria-hidden className="size-11 text-line-strong" />
      <h1 id="evento-no-encontrado" className="text-3xl text-ink">
        No encontramos este evento
      </h1>
      <p>Puede que el link esté mal o que el evento ya no esté publicado.</p>
      <Button asChild className="mt-2">
        <Link to={ROUTES.home}>Volver a explorar</Link>
      </Button>
    </section>
  )
}
