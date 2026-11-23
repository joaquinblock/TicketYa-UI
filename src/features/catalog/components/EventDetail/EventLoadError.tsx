import { CircleAlert } from 'lucide-react'
import { Button } from '@/shared/components/atoms/Button'

type EventLoadErrorProps = { onRetry: () => void }

export function EventLoadError({ onRetry }: EventLoadErrorProps) {
  return (
    <div role="alert">
      <CircleAlert aria-hidden />
      <h1>No pudimos cargar el evento</h1>
      <p>Revisá tu conexión y probá de nuevo. Si sigue pasando, el problema es nuestro.</p>
      <Button onClick={onRetry}>Reintentar</Button>
    </div>
  )
}
