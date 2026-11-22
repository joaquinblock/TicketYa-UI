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
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>

export function Badge({ tone, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}
