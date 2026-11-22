import { ROUTES } from '@/shared/lib/routes'

export const PURCHASE_STEP = {
  EXPLORE: 'explore',
  EVENT: 'event',
  QUEUE: 'queue',
  SEATS: 'seats',
  PAYMENT: 'payment',
} as const

export type PurchaseStep = (typeof PURCHASE_STEP)[keyof typeof PURCHASE_STEP]

type StepConfig = { step: PurchaseStep; label: string; path: (eventId: string) => string }

export const PURCHASE_STEPS: StepConfig[] = [
  { step: PURCHASE_STEP.EXPLORE, label: 'Explorar', path: () => ROUTES.home },
  { step: PURCHASE_STEP.EVENT, label: 'Evento', path: ROUTES.event },
  { step: PURCHASE_STEP.QUEUE, label: 'Fila virtual', path: ROUTES.queue },
  { step: PURCHASE_STEP.SEATS, label: 'Lugares', path: ROUTES.seats },
  { step: PURCHASE_STEP.PAYMENT, label: 'Pago', path: ROUTES.payment },
]

type BackLink = { label: string; path: (eventId: string) => string }

/** Todos los pasos menos Explorar, que no tiene a dónde volver. */
export type StepWithBackLink = Exclude<PurchaseStep, typeof PURCHASE_STEP.EXPLORE>

/** A dónde lleva "← Volver" en cada paso (como en el mockup: desde Pago se vuelve a Lugares). */
export const BACK_LINK_BY_STEP: Record<StepWithBackLink, BackLink> = {
  event: { label: 'Volver a explorar', path: () => ROUTES.home },
  queue: { label: 'Volver al evento', path: ROUTES.event },
  seats: { label: 'Volver al evento', path: ROUTES.event },
  payment: { label: 'Volver a tus lugares', path: ROUTES.seats },
}
