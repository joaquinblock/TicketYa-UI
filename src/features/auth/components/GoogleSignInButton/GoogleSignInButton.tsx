import { cn } from '@/shared/lib/cn'
import { GoogleButtonFace } from './GoogleButtonFace'
import { useGoogleSignIn } from './useGoogleSignIn'

type GoogleSignInButtonProps = {
  clientId: string
  isLoggingIn: boolean
  onCredential: (idToken: string) => void
}

/**
 * Se ve nuestro botón, pero el clic lo recibe el botón oficial de Google, invisible encima: es el
 * único que entrega el ID token. Mientras se canjea, el de Google se saca y queda "Ingresando…".
 */
export function GoogleSignInButton({
  clientId,
  isLoggingIn,
  onCredential,
}: GoogleSignInButtonProps) {
  const { containerRef } = useGoogleSignIn(clientId, onCredential)

  return (
    <div className="relative">
      <GoogleButtonFace tabIndex={-1} aria-hidden="true" disabled={isLoggingIn}>
        {isLoggingIn ? 'Ingresando…' : undefined}
      </GoogleButtonFace>
      <div
        ref={containerRef}
        className={cn(
          'absolute inset-0 flex items-center justify-center overflow-hidden opacity-0',
          isLoggingIn && 'hidden',
        )}
      />
    </div>
  )
}
