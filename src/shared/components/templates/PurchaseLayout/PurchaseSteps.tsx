import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { PURCHASE_STEPS, type PurchaseStep } from './purchaseSteps.constants'

type PurchaseStepsProps = { currentStep: PurchaseStep; eventId: string }

export function PurchaseSteps({ currentStep, eventId }: PurchaseStepsProps) {
  const currentIndex = PURCHASE_STEPS.findIndex(({ step }) => step === currentStep)

  return (
    <nav aria-label="Pasos de la compra">
      <ol className="flex flex-wrap items-center gap-1.5 text-label">
        {PURCHASE_STEPS.map(({ step, label, path }, index) => {
          const isDone = index < currentIndex
          const isCurrent = index === currentIndex
          return (
            <li
              key={step}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'flex items-center gap-1.5 font-semibold text-subtle',
                index > 0 &&
                  'before:mr-1 before:h-px before:w-2.5 before:bg-line-strong md:before:w-4.5',
                isCurrent && 'text-ink',
              )}
            >
              <span
                className={cn(
                  'grid size-5.5 place-items-center rounded-full bg-line text-micro font-bold text-muted',
                  isDone && 'bg-ink text-accent',
                  isCurrent && 'bg-accent text-ink',
                )}
              >
                {isDone ? <Check aria-hidden className="size-3" strokeWidth={3} /> : index + 1}
              </span>
              <StepLabel
                label={label}
                to={isDone ? path(eventId) : undefined}
                isCurrent={isCurrent}
              />
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

type StepLabelProps = { label: string; to?: string; isCurrent: boolean }

/** En mobile solo se lee el nombre del paso actual; los otros quedan para lectores de pantalla. */
function StepLabel({ label, to, isCurrent }: StepLabelProps) {
  const className = cn(!isCurrent && 'sr-only md:not-sr-only')
  if (to) {
    return (
      <Link
        to={to}
        className={cn('text-muted no-underline hover:text-ink hover:underline', className)}
      >
        {label}
      </Link>
    )
  }
  return <span className={className}>{label}</span>
}
