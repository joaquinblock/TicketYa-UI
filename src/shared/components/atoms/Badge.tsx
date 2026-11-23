import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'bg-line text-ink',
        success: 'bg-success text-success-ink',
        error: 'bg-error text-error-ink',
        warning: 'bg-warning text-warning-ink',
        info: 'bg-info text-info-ink',
        accent: 'bg-accent text-ink',
        /** Secundario: toma el color del texto de alrededor, para que no compita con otro badge. */
        outline: 'border border-current bg-transparent font-semibold opacity-80',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

export type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>

export function Badge({ tone, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}
