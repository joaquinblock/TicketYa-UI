import { useState } from 'react'
import { TEST_ACCOUNTS } from '../../constants/auth.constants'
import { GoogleButtonFace } from '../GoogleSignInButton/GoogleButtonFace'

type TestAccountChooserProps = {
  isLoggingIn: boolean
  onChoose: (userId: number) => void
}

/**
 * Sin client id de Google: el botón de Google abre un "Elegí una cuenta" con un email del seeder
 * por rol, como el selector de Google, y entra con esa cuenta.
 */
export function TestAccountChooser({ isLoggingIn, onChoose }: TestAccountChooserProps) {
  const [isChoosing, setIsChoosing] = useState(false)

  if (!isChoosing) {
    return <GoogleButtonFace onClick={() => setIsChoosing(true)} />
  }

  return (
    <div className="flex flex-col gap-2 text-left">
      <p className="text-label font-semibold text-muted">Elegí una cuenta</p>
      <ul className="flex flex-col overflow-hidden rounded-control border border-line">
        {TEST_ACCOUNTS.map(({ userId, email, role }) => (
          <li key={userId} className="border-b border-line last:border-b-0">
            <button
              type="button"
              disabled={isLoggingIn}
              onClick={() => onChoose(userId)}
              className="flex min-h-13 w-full cursor-pointer items-center gap-3 px-3.5 text-left hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span
                aria-hidden="true"
                className="grid size-8 flex-none place-items-center rounded-full bg-background text-xs font-bold uppercase"
              >
                {email.charAt(0)}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-ink">{email}</span>
                <span className="text-label text-subtle">{role}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {isLoggingIn && (
        <p role="status" className="text-center text-sm text-muted">
          Ingresando…
        </p>
      )}
    </div>
  )
}
