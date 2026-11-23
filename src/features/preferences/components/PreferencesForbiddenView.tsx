import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/atoms/Button'
import { ROUTES } from '@/shared/lib/routes'

export function PreferencesForbiddenView() {
  return (
    <section
      role="alert"
      className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-lg">Solo para clientes autenticados</h2>
        <p className="text-sm text-subtle">
          Iniciá sesión con una cuenta de cliente para configurar tus preferencias y favoritos.
        </p>
      </div>
      <Button asChild variant="accent">
        <Link to={ROUTES.home}>Volver al inicio</Link>
      </Button>
    </section>
  )
}
