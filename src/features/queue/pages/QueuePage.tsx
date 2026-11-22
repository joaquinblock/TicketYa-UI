import { useParams } from 'react-router-dom'
import { PageTitle } from '@/shared/components/atoms/PageTitle'
import { PurchaseLayout } from '@/shared/components/templates/PurchaseLayout/PurchaseLayout'
import { PURCHASE_STEP } from '@/shared/components/templates/PurchaseLayout/purchaseSteps.constants'

export function QueuePage() {
  const { eventId = '' } = useParams()
  return (
    <PurchaseLayout step={PURCHASE_STEP.QUEUE} eventId={eventId}>
      <PageTitle>Fila virtual</PageTitle>
    </PurchaseLayout>
  )
}
