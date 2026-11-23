import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/routes'

type QueueErrorViewProps = {
  eventId: string
  title: string
  description: string
  canRetry: boolean
  onRetry: () => void
}

export function QueueErrorView({
  eventId,
  title,
  description,
  canRetry,
  onRetry,
}: QueueErrorViewProps) {
  return (
    <section
      aria-labelledby="fila-error"
      className="mx-auto w-full max-w-150 rounded-[18px] border border-line bg-surface px-5 py-8 text-center md:p-10"
    >
      <h1 id="fila-error" className="text-[26px] font-bold">
        {title}
      </h1>
      <p className="mt-2 mb-6 text-control text-subtle">{description}</p>
      {canRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex min-h-13.5 w-full cursor-pointer items-center justify-center rounded-xl border-0 bg-accent text-base font-bold text-ink hover:bg-accent-hover"
        >
          Reintentar
        </button>
      ) : (
        <Link
          to={eventId ? ROUTES.event(eventId) : ROUTES.home}
          className="inline-flex min-h-13.5 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-ink no-underline hover:bg-accent-hover hover:text-ink"
        >
          Volver al evento
        </Link>
      )}
    </section>
  )
}
