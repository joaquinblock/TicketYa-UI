import { cn } from '@/shared/lib/cn'

/** `className` es solo para el ancho: sobre el mapa se centra, en el panel de cantidad va entero. */
export function Stage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mx-auto grid h-8.5 w-full max-w-140 place-items-center rounded-md bg-ink text-micro font-bold tracking-stage text-surface uppercase',
        className,
      )}
    >
      Escenario
    </div>
  )
}
