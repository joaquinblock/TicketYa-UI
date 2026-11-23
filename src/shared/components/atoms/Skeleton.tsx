import { cn } from '@/shared/lib/cn'

/** Un bloque que late mientras carga. La forma (alto, ancho, radio) la pone quien lo usa. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('block animate-pulse bg-line motion-reduce:animate-none', className)}
    />
  )
}
