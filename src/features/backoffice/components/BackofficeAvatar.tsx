import type { BackofficeUser } from '../types/backoffice.types'
import { formatBackofficeInitials } from '../utils/backofficeFormat'

/** `.bo-user-avatar`: las iniciales del usuario, en el sidebar y en el topbar. */
export function BackofficeAvatar({ user }: { user: BackofficeUser | undefined }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-8 flex-none place-items-center rounded-full bg-backoffice-avatar text-[10px] font-[750] text-backoffice-avatar-ink"
    >
      {user ? formatBackofficeInitials(user) : ''}
    </span>
  )
}
