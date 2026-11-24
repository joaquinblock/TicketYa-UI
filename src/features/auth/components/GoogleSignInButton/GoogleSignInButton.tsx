import { Button } from '@/shared/components/atoms/Button'
import { cn } from '@/shared/lib/cn'
import { useGoogleSignIn } from './useGoogleSignIn'

type GoogleSignInButtonProps = {
  clientId: string
  isLoggingIn: boolean
  onCredential: (idToken: string) => void
}

/**
 * El botón oficial de Google, el que el usuario ya conoce (Jakob). Mientras se canjea el token,
 * queda en su lugar uno deshabilitado que dice que está trabajando (Doherty, Nielsen 1).
 */
export function GoogleSignInButton({
  clientId,
  isLoggingIn,
  onCredential,
}: GoogleSignInButtonProps) {
  const { containerRef } = useGoogleSignIn(clientId, onCredential)

  return (
    <div className="flex min-h-12.5 justify-center">
      <div ref={containerRef} className={cn(isLoggingIn && 'hidden')} />
      {isLoggingIn && (
        <Button variant="ghost" disabled className="min-h-12.5 w-full">
          Ingresando…
        </Button>
      )}
    </div>
  )
}
