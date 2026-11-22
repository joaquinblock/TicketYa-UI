import { Route } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/routes'
import { MyTicketsPage } from '../pages/MyTicketsPage'

export const ticketsRoute = <Route path={ROUTES.myTickets} element={<MyTicketsPage />} />
