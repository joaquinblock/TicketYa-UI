import { Route } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/routes'
import { PreferencesPage } from '../pages/PreferencesPage'

export const preferencesRoute = <Route path={ROUTES.preferences} element={<PreferencesPage />} />
