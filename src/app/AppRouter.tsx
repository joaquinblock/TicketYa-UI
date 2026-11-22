import { Route, Routes } from 'react-router-dom'
import { catalogRoute } from '@/features/catalog/routes/catalog.route'
import { preferencesRoute } from '@/features/preferences/routes/preferences.route'
import { purchaseRoute } from '@/features/purchase/routes/purchase.route'
import { queueRoute } from '@/features/queue/routes/queue.route'
import { ticketsRoute } from '@/features/tickets/routes/tickets.route'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { StoreLayout } from '@/shared/components/templates/StoreLayout'
import { ROUTES } from '@/shared/lib/routes'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route path={ROUTES.home} element={<HomePage />} />
        {catalogRoute}
        {queueRoute}
        {purchaseRoute}
        {ticketsRoute}
        {preferencesRoute}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
