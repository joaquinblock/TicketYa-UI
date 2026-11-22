import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/atoms/Button'
import { PageTitle } from '@/shared/components/atoms/PageTitle'
import { ROUTES } from '@/shared/lib/routes'

export function NotFoundPage() {
  return (
    <section className="mx-auto flex w-full max-w-310 flex-col items-start gap-4 px-4 py-16 md:px-7">
      <PageTitle>No encontramos esta página</PageTitle>
      <p className="text-muted">Puede que el link esté mal o que la página ya no exista.</p>
      <Button asChild>
        <Link to={ROUTES.home}>Ir a Inicio</Link>
      </Button>
    </section>
  )
}
