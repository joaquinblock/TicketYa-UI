import { Route } from 'react-router-dom'
import { ROUTE_PATTERNS } from '@/shared/lib/routes'
import { QueuePage } from '../pages/QueuePage/QueuePage'

export const queueRoute = <Route path={ROUTE_PATTERNS.queue} element={<QueuePage />} />
