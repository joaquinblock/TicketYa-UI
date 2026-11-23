import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { PurchaseLayout } from '@/shared/components/templates/PurchaseLayout/PurchaseLayout'
import { PURCHASE_STEP } from '@/shared/components/templates/PurchaseLayout/purchaseSteps.constants'
import { EventDetail } from '../components/EventDetail/EventDetail'
import { EventDetailSkeleton } from '../components/EventDetail/EventDetailSkeleton'
import { EventLoadError } from '../components/EventDetail/EventLoadError'
import { EventNotFound } from '../components/EventDetail/EventNotFound'
import { useEvent } from '../hooks/useEvent'
import { parseEventId } from '../lib/eventId'

/** Sin evento no hay compra: "no encontrado" va sin los pasos; los demás estados, dentro de ellos. */
export function EventPage() {
  const { eventId = '' } = useParams()
  const { event, isNotFound, isError, refetch } = useEvent(parseEventId(eventId))

  if (isNotFound) return <EventNotFound />

  let content: ReactNode
  if (isError) content = <EventLoadError onRetry={() => refetch()} />
  else if (event) content = <EventDetail event={event} />
  else content = <EventDetailSkeleton />

  return (
    <PurchaseLayout step={PURCHASE_STEP.EVENT} eventId={eventId}>
      {content}
    </PurchaseLayout>
  )
}
