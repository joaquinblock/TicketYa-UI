import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'
import googleIcon from '../../assets/google.svg'

/** El botón "Continuar con Google" (mismo diseño que el de barber-project): blanco, con sombra y el logo. */
export function GoogleButtonFace({ className, children, ...props }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-13.5 w-full cursor-pointer items-center justify-center gap-2 rounded-control bg-surface text-base font-medium text-ink shadow-sm disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <img src={googleIcon} alt="" aria-hidden="true" className="size-5.75" />
      <span>{children ?? 'Continuar con Google'}</span>
    </button>
  )
}
