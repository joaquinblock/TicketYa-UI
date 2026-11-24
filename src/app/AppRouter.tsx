import { Route, Routes } from 'react-router-dom'
import { LoginDialog } from '@/features/auth/components/LoginDialog/LoginDialog'
import { SessionMenu } from '@/features/auth/components/SessionMenu/SessionMenu'
import { catalogRoute } from '@/features/catalog/routes/catalog.route'
import { preferencesRoute } from '@/features/preferences/routes/preferences.route'
import { purchaseRoute } from '@/features/purchase/routes/purchase.route'
import { queueRoute } from '@/features/queue/routes/queue.route'
import { ticketsRoute } from '@/features/tickets/routes/tickets.route'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { StoreLayout } from '@/shared/components/templates/StoreLayout'
import { ROUTES } from '@/shared/lib/routes'

/** El login va antes de las rutas: así escucha los pedidos de las pantallas desde el primer render. */
export function AppRouter() {
  return (
    <>
      <LoginDialog />
      <Routes>
        <Route element={<StoreLayout headerActions={<SessionMenu />} />}>
          <Route path={ROUTES.home} element={<HomePage />} />
          {catalogRoute}
          {queueRoute}
          {purchaseRoute}
          {ticketsRoute}
          {preferencesRoute}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}
