import { Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { NAV_ITEMS } from '../navItems.constants'
import { useMobileNav } from './useMobileNav'

const PANEL_ID = 'mobile-nav-panel'

/** Navegación de mobile: botón hamburguesa y panel que se despliega debajo del header. */
export function MobileNav() {
  const { isOpen, toggle, close } = useMobileNav()

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        onClick={toggle}
        className="grid size-11 cursor-pointer place-items-center rounded-full text-ink hover:bg-surface-hover"
      >
        {isOpen ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
      </button>
      {isOpen && (
        <nav
          id={PANEL_ID}
          aria-label="Menú"
          className="absolute inset-x-0 top-full border-b border-line bg-surface shadow-lg"
        >
          <ul className="flex flex-col py-2">
            {NAV_ITEMS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  onClick={close}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-12 items-center border-l-4 border-transparent px-4 text-base font-semibold text-muted no-underline hover:text-ink',
                      isActive && 'border-accent text-ink',
                    )
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
