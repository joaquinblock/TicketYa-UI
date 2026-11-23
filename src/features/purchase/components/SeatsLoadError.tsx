import { CircleAlert } from 'lucide-react'
import { useId } from 'react'
import { Button } from '@/shared/components/atoms/Button'

type SeatsLoadErrorProps = { onRetry: () => void }

export function SeatsLoadError({ onRetry }: SeatsLoadErrorProps) {
  const titleId = useId()
  return (
    <div
      role="alert"
      aria-labelledby={titleId}
      className="flex flex-col items-center gap-2.5 rounded-card border border-line bg-surface px-5 py-12 text-center text-muted"
    >
      <CircleAlert aria-hidden className="size-11 text-error-ink" />
      <h2 id={titleId} className="text-2xl text-ink">
        No pudimos cargar los lugares
      </h2>
      <p>Revisá tu conexión y probá de nuevo. Si sigue pasando, el problema es nuestro.</p>
      <Button onClick={onRetry}>Reintentar</Button>
    </div>
  )
}
