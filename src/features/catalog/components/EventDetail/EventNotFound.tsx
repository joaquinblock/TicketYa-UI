import { CalendarX2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/atoms/Button'
import { ROUTES } from '@/shared/lib/routes'

/** Sin evento no hay compra: sin los pasos, con un solo "Volver a explorar". */
export function EventNotFound() {
  return (
    <section aria-labelledby="evento-no-encontrado">
      <CalendarX2 aria-hidden />
      <h1 id="evento-no-encontrado">No encontramos este evento</h1>
      <p>Puede que el link esté mal o que el evento ya no esté publicado.</p>
      <Button asChild>
        <Link to={ROUTES.home}>Volver a explorar</Link>
      </Button>
    </section>
  )
}
