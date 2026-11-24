import { ArrowRight, Bell, Menu } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/routes'

type BackofficeTopbarProps = {
  crumbLabel: string
  accountMenu: ReactNode
  onToggleNav: () => void
}

/** `.bo-topbar` del diseño: migas, "Ir a la tienda", notificaciones y el menú de la cuenta. */
export function BackofficeTopbar({ crumbLabel, accountMenu, onToggleNav }: BackofficeTopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14.5 items-center gap-1.75 border-b border-backoffice-line bg-surface px-3.25 sm:h-16.75 sm:gap-3.75 sm:px-5 md:px-8.5">
      <button
        type="button"
        aria-label="Abrir navegación"
        onClick={onToggleNav}
        className="grid size-11 cursor-pointer place-items-center border-0 bg-transparent sm:hidden"
      >
        <Menu aria-hidden className="size-5" />
      </button>
      <div className="flex items-center gap-2.5 text-[10px] font-semibold text-[#4d4a43] sm:text-[11px]">
        <span className="font-medium text-[#98958d]">TicketYa</span>
        <b className="font-normal text-[#cfccc4]">/</b>
        {crumbLabel}
      </div>
      <div className="ml-auto flex items-center gap-2.25 sm:gap-4.5">
        <Link
          to={ROUTES.home}
          className="hidden items-center gap-1.75 text-[11px] text-[#55524b] no-underline hover:text-ink sm:flex"
        >
          Ir a la tienda <ArrowRight aria-hidden className="size-3.75" />
        </Link>
        <Link
          to={ROUTES.preferences}
          aria-label="Notificaciones"
          className="grid size-11 place-items-center rounded-full text-ink hover:text-ink"
        >
          <span className="grid size-8.25 place-items-center rounded-full bg-[#f7f6f2]">
            <Bell aria-hidden className="size-4.5" />
          </span>
        </Link>
        {accountMenu}
      </div>
    </header>
  )
}
