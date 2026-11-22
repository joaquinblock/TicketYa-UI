import { ROUTES } from '@/shared/lib/routes'

export const NAV_ITEMS = [
  { to: ROUTES.home, label: 'Explorar' },
  { to: ROUTES.myTickets, label: 'Mis entradas' },
  { to: ROUTES.preferences, label: 'Preferencias' },
] as const
