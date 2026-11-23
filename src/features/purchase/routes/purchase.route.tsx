import { Route } from 'react-router-dom'
import { ROUTE_PATTERNS } from '@/shared/lib/routes'
import { PaymentPage } from '../pages/PaymentPage'
import { SeatsPage } from '../pages/SeatsPage/SeatsPage'

export const purchaseRoute = (
  <>
    <Route path={ROUTE_PATTERNS.seats} element={<SeatsPage />} />
    <Route path={ROUTE_PATTERNS.payment} element={<PaymentPage />} />
  </>
)
