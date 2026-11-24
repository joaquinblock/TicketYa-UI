import type { ReactNode } from 'react'
import { Route } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/routes'
import { AccessLayout } from '../components/AccessLayout/AccessLayout'
import { AccessHomePage } from '../pages/AccessHomePage'
import { AccessScanPage } from '../pages/AccessScanPage'

/** Fuera del layout de la tienda y del backoffice: la puerta tiene su propio marco para el celular. */
export function accessRoute(accountMenu: ReactNode) {
  return (
    <Route element={<AccessLayout accountMenu={accountMenu} />}>
      <Route path={ROUTES.access.home} element={<AccessHomePage />} />
      <Route path={ROUTES.access.scan} element={<AccessScanPage />} />
    </Route>
  )
}
