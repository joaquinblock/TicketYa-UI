import { useParams } from 'react-router-dom'
import { PageTitle } from '@/shared/components/atoms/PageTitle'
import { PurchaseLayout } from '@/shared/components/templates/PurchaseLayout/PurchaseLayout'
import { PURCHASE_STEP } from '@/shared/components/templates/PurchaseLayout/purchaseSteps.constants'

export function PaymentPage() {
  const { eventId = '' } = useParams()
  return (
    <PurchaseLayout step={PURCHASE_STEP.PAYMENT} eventId={eventId}>
      <PageTitle>¿Cómo querés pagar?</PageTitle>
    </PurchaseLayout>
  )
}
