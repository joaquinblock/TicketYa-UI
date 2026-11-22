import { Route } from 'react-router-dom'
import { ROUTE_PATTERNS } from '@/shared/lib/routes'
import { EventPage } from '../pages/EventPage'

export const catalogRoute = <Route path={ROUTE_PATTERNS.event} element={<EventPage />} />
