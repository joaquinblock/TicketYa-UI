import { Button } from '@/shared/components/atoms/Button'
import { formatFullName, formatInitials } from '../../utils/userFormat'
import { useSessionMenu } from './useSessionMenu'

/** Lugar del usuario en el header: "Ingresar" sin sesión, o su nombre para salir (mockup `Main`). */
export function SessionMenu() {
  const { user, isLoggedIn, logout, login } = useSessionMenu()

  if (!isLoggedIn) return <Button onClick={login}>Ingresar</Button>
  if (!user) return null

  const fullName = formatFullName(user)
  return (
    <button
      type="button"
      onClick={logout}
      aria-label={`${fullName}, salir`}
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
  )
}
