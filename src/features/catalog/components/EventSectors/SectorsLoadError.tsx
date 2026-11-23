import { CircleAlert } from 'lucide-react'
import { Button } from '@/shared/components/atoms/Button'

type SectorsLoadErrorProps = { onRetry: () => void }

/** El error queda dentro de la sección: el resto del detalle no depende de la disponibilidad. */
export function SectorsLoadError({ onRetry }: SectorsLoadErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2.5 rounded-card border border-line bg-surface px-5 py-10 text-center text-muted"
    >
      <CircleAlert aria-hidden className="size-9 text-error-ink" />
      <p className="text-lg font-bold text-ink">No pudimos cargar los sectores</p>
      <p>Revisá tu conexión y probá de nuevo.</p>
      <Button onClick={onRetry}>Reintentar</Button>
    </div>
  )
}
