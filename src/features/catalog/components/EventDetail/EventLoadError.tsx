import { CircleAlert } from 'lucide-react'
import { Button } from '@/shared/components/atoms/Button'

type EventLoadErrorProps = { onRetry: () => void }

export function EventLoadError({ onRetry }: EventLoadErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2.5 rounded-card border border-line bg-surface px-5 py-12 text-center text-muted"
    >
      <CircleAlert aria-hidden className="size-11 text-error-ink" />
      <h1 className="text-2xl text-ink">No pudimos cargar el evento</h1>
      <p>Revisá tu conexión y probá de nuevo. Si sigue pasando, el problema es nuestro.</p>
      <Button onClick={onRetry}>Reintentar</Button>
    </div>
  )
}
