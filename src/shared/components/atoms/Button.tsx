import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

const buttonVariants = cva(
  'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-control border px-5 text-control font-semibold no-underline transition-colors disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'border-ink bg-ink text-surface hover:bg-ink-hover hover:text-surface',
        accent: 'border-accent bg-accent text-ink hover:bg-accent-hover hover:text-ink',
        ghost: 'border-line-strong bg-surface text-ink hover:bg-surface-hover hover:text-ink',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
)

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Renderiza el hijo (por ejemplo un `Link`) con el estilo del botón. */
    asChild?: boolean
  }

export function Button({ variant, asChild = false, className, ...props }: ButtonProps) {
  const Component = asChild ? Slot : 'button'
  return <Component className={cn(buttonVariants({ variant }), className)} {...props} />
}
