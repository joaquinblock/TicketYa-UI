import { Button } from '@/shared/components/atoms/Button'

type PreferencesLoadErrorProps = {
  message: string
  onRetry: () => void
}

export function PreferencesLoadError({ message, onRetry }: PreferencesLoadErrorProps) {
  return (
    <section
      role="alert"
      className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-lg">No pudimos cargar tus preferencias</h2>
        <p className="text-sm text-subtle">{message}</p>
      </div>
      <Button type="button" variant="accent" onClick={onRetry}>
        Reintentar
      </Button>
    </section>
  )
}
