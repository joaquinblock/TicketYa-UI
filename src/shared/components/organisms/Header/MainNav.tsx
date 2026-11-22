import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { ROUTES } from '@/shared/lib/routes'

const NAV_ITEMS = [
  { to: ROUTES.home, label: 'Explorar' },
  { to: ROUTES.myTickets, label: 'Mis entradas' },
  { to: ROUTES.preferences, label: 'Preferencias' },
] as const

export function MainNav() {
  return (
    <nav
      aria-label="Principal"
      className="col-span-full row-start-2 flex min-h-11 justify-center gap-6 self-stretch md:col-span-1 md:col-start-2 md:row-start-1 md:gap-8"
    >
      {NAV_ITEMS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            cn(
              'relative flex items-center text-sm font-semibold text-muted no-underline hover:text-ink',
              isActive &&
                'text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-0.75 after:rounded-t-sm after:bg-accent',
            )
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
