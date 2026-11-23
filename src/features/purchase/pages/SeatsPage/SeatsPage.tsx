import { useParams } from 'react-router-dom'
import { PageTitle } from '@/shared/components/atoms/PageTitle'
import { PurchaseLayout } from '@/shared/components/templates/PurchaseLayout/PurchaseLayout'
import { PURCHASE_STEP } from '@/shared/components/templates/PurchaseLayout/purchaseSteps.constants'

export function SeatsPage() {
  const { eventId = '' } = useParams()
  return (
    <PurchaseLayout step={PURCHASE_STEP.SEATS} eventId={eventId}>
      <PageTitle>Elegí tus lugares</PageTitle>
    </PurchaseLayout>
  )
}
