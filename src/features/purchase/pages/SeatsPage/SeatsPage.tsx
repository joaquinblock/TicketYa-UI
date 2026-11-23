import { useParams } from 'react-router-dom'
import { PurchaseLayout } from '@/shared/components/templates/PurchaseLayout/PurchaseLayout'
import { PURCHASE_STEP } from '@/shared/components/templates/PurchaseLayout/purchaseSteps.constants'
import { SeatsHeader } from '../../components/SeatsHeader'
import { useSeatsPageController } from './useSeatsPageController'

export function SeatsPage() {
  const { eventId = '' } = useParams()
  const { event } = useSeatsPageController(eventId)

  return (
    <PurchaseLayout step={PURCHASE_STEP.SEATS} eventId={eventId}>
      <SeatsHeader event={event} />
    </PurchaseLayout>
  )
}
