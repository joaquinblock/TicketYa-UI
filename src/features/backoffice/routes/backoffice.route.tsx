import type { ReactNode } from 'react'
import { Route } from 'react-router-dom'
import { BackofficeLayout } from '../components/BackofficeLayout/BackofficeLayout'
import { BACKOFFICE_SECTION_META } from '../constants/backoffice.constants'
import { BackofficeHomePage } from '../pages/BackofficeHomePage'
import { BackofficeSectionPage } from '../pages/BackofficeSectionPage'
import { RefundsPage } from '../pages/RefundsPage'
import type { BackofficeSection } from '../types/backoffice.types'

const SECTIONS_WITHOUT_HOME = (Object.keys(BACKOFFICE_SECTION_META) as BackofficeSection[]).filter(
  (section) => section !== 'home' && section !== 'refunds',
)

/**
 * Fuera del layout de la tienda: el backoffice tiene su propio marco, sin header ni footer. El menú
 * de la cuenta lo pone AppRouter, como en la tienda.
 */
export function backofficeRoute(accountMenu: ReactNode) {
  return (
    <Route element={<BackofficeLayout accountMenu={accountMenu} />}>
      <Route path={BACKOFFICE_SECTION_META.home.path} element={<BackofficeHomePage />} />
      <Route path={BACKOFFICE_SECTION_META.refunds.path} element={<RefundsPage />} />
      {SECTIONS_WITHOUT_HOME.map((section) => (
        <Route
          key={section}
          path={BACKOFFICE_SECTION_META[section].path}
          element={<BackofficeSectionPage section={section} />}
        />
      ))}
    </Route>
  )
}
