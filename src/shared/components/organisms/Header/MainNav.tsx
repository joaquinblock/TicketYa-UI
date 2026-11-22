import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { NAV_ITEMS } from './navItems.constants'

/** Navegación de escritorio. En mobile la reemplaza `MobileNav`. */
export function MainNav() {
  return (
    <nav aria-label="Principal" className="hidden gap-8 self-stretch md:col-start-2 md:flex">
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
