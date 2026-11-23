import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PurchaseSteps } from './PurchaseSteps'
import { BACK_LINK_BY_STEP, type StepWithBackLink } from './purchaseSteps.constants'

type PurchaseLayoutProps = {
  step: StepWithBackLink
  eventId: string
  completed?: boolean
  children: ReactNode
}

/** Template de la compra: "← Volver" y los pasos arriba, y el contenido del paso abajo. */
export function PurchaseLayout({ step, eventId, completed, children }: PurchaseLayoutProps) {
  const backLink = BACK_LINK_BY_STEP[step]

  return (
    <div className="mx-auto flex w-full max-w-310 flex-col gap-8 px-4 pt-4 pb-16 md:px-7">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <Link
          to={backLink.path(eventId)}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted no-underline hover:text-ink"
        >
          <ArrowLeft aria-hidden className="size-4.5" />
          {backLink.label}
        </Link>
        <PurchaseSteps currentStep={step} eventId={eventId} completed={completed} />
      </div>
      {children}
    </div>
  )
}
