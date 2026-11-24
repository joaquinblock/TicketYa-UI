import { Ticket, X } from 'lucide-react'
import { type MouseEvent, useId } from 'react'
import { GOOGLE_CLIENT_ID, IS_DEV_LOGIN_ENABLED } from '../../constants/auth.constants'
import { GoogleSignInButton } from '../GoogleSignInButton/GoogleSignInButton'
import { DevLoginForm } from './DevLoginForm'
import { useLoginDialogController } from './useLoginDialogController'

/** "Ingresá a TicketYa": se abre sobre la pantalla actual, que queda como estaba detrás. */
export function LoginDialog() {
  const titleId = useId()
  const {
    dialogRef,
    isOpen,
    close,
    loginWithGoogleCredential,
    loginAsDevUser,
    isLoggingIn,
    errorMessage,
  } = useLoginDialogController()

  if (!isOpen) return null

  const closeOnBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) close()
  }

  return (
    <div
      onClick={closeOnBackdrop}
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink/55 p-4"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex w-105 max-w-full flex-col gap-3.5 rounded-2xl bg-surface p-8.5 text-center"
      >
        <button
          type="button"
          aria-label="Cerrar"
          disabled={isLoggingIn}
          onClick={close}
          className="absolute top-2.5 right-2.5 grid size-11 cursor-pointer place-items-center rounded-full text-ink hover:bg-surface-hover disabled:cursor-not-allowed"
        >
          <X aria-hidden className="size-4.5" />
        </button>
        <span className="mx-auto grid size-11 place-items-center rounded-control bg-accent">
          <Ticket aria-hidden className="size-5.5" />
        </span>
        <h2 id={titleId} className="text-[28px]">
          Ingresá a TicketYa
        </h2>
        <p className="leading-relaxed text-muted">
          Usamos tu cuenta de Google. Si es la primera vez, te creamos una cuenta de cliente.
        </p>
        {errorMessage && (
          <p
            role="alert"
            className="rounded-control bg-error px-3.5 py-2.5 text-sm font-medium text-error-ink"
          >
            {errorMessage}
          </p>
        )}
        {GOOGLE_CLIENT_ID && (
          <GoogleSignInButton
            clientId={GOOGLE_CLIENT_ID}
            isLoggingIn={isLoggingIn}
            onCredential={loginWithGoogleCredential}
          />
        )}
        <small className="text-label text-subtle">
          Organizadores y personal de acceso entran con el mismo botón.
        </small>
        {IS_DEV_LOGIN_ENABLED && (
          <DevLoginForm isLoggingIn={isLoggingIn} onLogin={loginAsDevUser} />
        )}
      </div>
    </div>
  )
}
