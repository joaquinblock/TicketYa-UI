import { useParams } from 'react-router-dom'
import { PurchaseLayout } from '@/shared/components/templates/PurchaseLayout/PurchaseLayout'
import { PURCHASE_STEP } from '@/shared/components/templates/PurchaseLayout/purchaseSteps.constants'
import { EventDetail } from '../components/EventDetail/EventDetail'
import { EventNotFound } from '../components/EventDetail/EventNotFound'
import { useEvent } from '../hooks/useEvent'
import { parseEventId } from '../lib/eventId'

export function EventPage() {
  const { eventId = '' } = useParams()
  const { event, isNotFound } = useEvent(parseEventId(eventId))

  if (isNotFound) return <EventNotFound />

  return (
    <PurchaseLayout step={PURCHASE_STEP.EVENT} eventId={eventId}>
      {event && <EventDetail event={event} />}
    </PurchaseLayout>
  )
}
