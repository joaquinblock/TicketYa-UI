import { ArrowLeft, Building2, ChevronDown, MoreHorizontal, Ticket } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { ROUTES } from '@/shared/lib/routes'
import { BACKOFFICE_ROLE_META, BACKOFFICE_SECTION_META } from '../constants/backoffice.constants'
import type { BackofficeRole, BackofficeSection, BackofficeUser } from '../types/backoffice.types'
import { formatBackofficeName } from '../utils/backofficeFormat'
import { BackofficeAvatar } from './BackofficeAvatar'

type BackofficeSidebarProps = {
  role: BackofficeRole
  organizationName: string
  user: BackofficeUser | undefined
  isOpen: boolean
  onNavigate: () => void
}

/** `.bo-sidebar` del diseño. En mobile (< 640 px) es un panel que entra desde la izquierda. */
export function BackofficeSidebar({
  role,
  organizationName,
  user,
  isOpen,
  onNavigate,
}: BackofficeSidebarProps) {
  const roleLabel = BACKOFFICE_ROLE_META[role].label

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-51 flex h-dvh w-[min(290px,84vw)] -translate-x-[105%] flex-col border-r border-backoffice-line bg-surface px-3.75 pt-5 pb-3.5 shadow-[10px_0_40px_#0002] transition-transform duration-200',
        'sm:sticky sm:top-0 sm:z-31 sm:w-55 sm:flex-none sm:translate-x-0 sm:shadow-none md:w-57 lg:w-65',
        isOpen && 'translate-x-0',
      )}
    >
      <Link
        to={ROUTES.home}
        className="mb-6 flex h-10.25 items-center gap-2.25 px-2.25 font-display text-[21px] font-extrabold tracking-[-0.8px] text-ink no-underline hover:text-ink"
      >
        <span className="grid size-7.75 place-items-center rounded-[9px] bg-accent">
          <Ticket aria-hidden className="size-4.75" />
        </span>
        <span>TicketYa</span>
        <small className="ml-auto rounded-sm bg-backoffice-chip px-1.25 py-1 font-sans text-[8px] font-bold tracking-[0.8px] text-[#78756d]">
          BACKOFFICE
        </small>
      </Link>

      <div className="mb-6.25 flex items-center gap-2.5 rounded-[9px] border border-backoffice-line px-2.25 py-2.75">
        <div className="grid size-8 flex-none place-items-center rounded-lg bg-backoffice-org text-backoffice-org-ink">
          <Building2 aria-hidden className="size-4.25" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <b className="truncate text-[11px]">{organizationName}</b>
          <small className="text-[10px] text-backoffice-muted">{roleLabel}</small>
        </div>
        <ChevronDown aria-hidden className="size-3.75 text-[#87837b]" />
      </div>

      <div className="mb-2.25 px-2.5 text-[9px] font-bold tracking-[1.05px] text-backoffice-faint">
        ESPACIO DE TRABAJO
      </div>
      <nav aria-label="Secciones del backoffice" className="flex flex-col gap-0.75">
        {BACKOFFICE_ROLE_META[role].sections.map((section) => (
          <SidebarLink key={section} section={section} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <SidebarLink section="settings" onNavigate={onNavigate} />
        <Link
          to={ROUTES.home}
          className="flex items-center gap-2 px-2.5 py-2.75 text-[11px] text-[#5f5c56] no-underline hover:text-ink"
        >
          <ArrowLeft aria-hidden className="size-3.75" /> Volver a la tienda pública
        </Link>
        <div className="mt-2.25 flex items-center gap-2.25 border-t border-backoffice-line px-0.5 pt-3.25 pb-1">
          <BackofficeAvatar user={user} />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <b className="truncate text-[11px]">{user ? formatBackofficeName(user) : ''}</b>
            <small className="text-[10px] text-backoffice-muted">{roleLabel}</small>
          </div>
          <MoreHorizontal aria-hidden className="size-4.5 text-[#76736c]" />
        </div>
        <span className="px-1 pt-2.75 text-[9px] text-[#9b988f]">
          TicketYa · Hecho en Argentina
        </span>
      </div>
    </aside>
  )
}

function SidebarLink({
  section,
  onNavigate,
}: {
  section: BackofficeSection
  onNavigate: () => void
}) {
  const { label, path, icon: Icon } = BACKOFFICE_SECTION_META[section]

  return (
    <NavLink
      to={path}
      end
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex min-h-10 w-full items-center gap-2.75 rounded-[7px] px-2.75 py-2.5 text-left text-xs text-backoffice-nav no-underline transition-colors hover:bg-surface-hover hover:text-backoffice-nav',
          isActive &&
            'bg-backoffice-active font-[650] text-[#171717] hover:bg-backoffice-active hover:text-[#171717]',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            aria-hidden
            className={cn('size-4.25', isActive && 'text-backoffice-active-icon')}
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  )
}
