import { LoaderCircle } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

type SpinnerProps = { label?: string; className?: string }

export function Spinner({ label = 'Cargando', className }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={cn('inline-flex text-muted', className)}>
      <LoaderCircle aria-hidden className="size-5 animate-spin" />
      <span className="sr-only">{label}</span>
    </span>
  )
}
