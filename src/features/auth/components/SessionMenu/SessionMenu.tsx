import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/atoms/Button'
import { ROUTES } from '@/shared/lib/routes'
import type { CurrentUser } from '../../types/auth.types'
import { formatFullName, formatInitials } from '../../utils/userFormat'
import { useSessionMenu } from './useSessionMenu'

/**
 * Lugar del usuario en el header: "Ingresar" sin sesión, o su avatar, que abre un menú con sus
 * pantallas y "Cerrar sesión". Salir es una acción explícita, nunca un toque al nombre (Nielsen 3).
 */
export function SessionMenu() {
  const { user, isLoggedIn, logout, login } = useSessionMenu()
  const [isOpen, setIsOpen] = useState(false)

  if (!isLoggedIn) return <Button onClick={login}>Ingresar</Button>
  if (!user) return null

  const close = () => setIsOpen(false)
  const fullName = formatFullName(user)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={`Cuenta de ${fullName}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-full px-1 text-sm font-semibold text-ink hover:bg-surface-hover md:pr-3"
      >
        <span
          aria-hidden="true"
          className="grid size-8.5 place-items-center rounded-full bg-background text-xs font-bold"
        >
          {formatInitials(user)}
        </span>
        <span aria-hidden="true" className="hidden md:inline">
          {fullName}
        </span>
      </button>
      {isOpen && (
        <>
          <div aria-hidden="true" className="fixed inset-0 z-20" onClick={close} />
          <UserMenu user={user} onNavigate={close} onLogout={logout} />
        </>
      )}
    </div>
  )
}

type UserMenuProps = {
  user: CurrentUser
  onNavigate: () => void
  onLogout: () => void
}

function UserMenu({ user, onNavigate, onLogout }: UserMenuProps) {
  const itemClassName =
    'flex min-h-11 w-full cursor-pointer items-center gap-2 px-4 text-left text-sm font-semibold text-ink no-underline hover:bg-surface-hover hover:text-ink'

  return (
    <div
      role="menu"
      aria-label="Tu cuenta"
      className="absolute top-full right-0 z-30 mt-2 w-64 overflow-hidden rounded-card border border-line-strong bg-surface shadow-lg"
    >
      <div className="border-b border-line px-4 py-3">
        <p className="text-sm font-bold text-ink">{formatFullName(user)}</p>
        <p className="truncate text-label text-subtle">{user.email}</p>
      </div>
      <Link role="menuitem" to={ROUTES.myTickets} onClick={onNavigate} className={itemClassName}>
        Mis entradas
      </Link>
      <Link role="menuitem" to={ROUTES.preferences} onClick={onNavigate} className={itemClassName}>
        Preferencias
      </Link>
      <button
        type="button"
        role="menuitem"
        onClick={onLogout}
        className={`${itemClassName} border-t border-line`}
      >
        <LogOut aria-hidden className="size-4" />
        Cerrar sesión
      </button>
    </div>
  )
}
