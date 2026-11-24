import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveAccessToken } from '@/shared/lib/session'
import { devLogin, loginWithGoogle } from '../../services/auth.service'
import type { TokenExchange } from '../../types/auth.types'
import { formatLoginError } from '../../utils/loginErrorFormat'

/**
 * Canjea las credenciales por el JWT de TicketYa y lo guarda. Las pantallas que fallaron sin
 * sesión se vuelven a pedir, para que carguen sin recargar la página.
 */
export function useLogin(onLoggedIn: () => void) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (exchange: TokenExchange) => exchange(),
    meta: { handlesErrorInline: true },
    onSuccess: ({ accessToken }) => {
      saveAccessToken(accessToken)
      void queryClient.invalidateQueries()
      onLoggedIn()
    },
  })

  return {
    loginWithGoogleCredential: (idToken: string) => mutation.mutate(() => loginWithGoogle(idToken)),
    loginAsDevUser: (userId: number) => mutation.mutate(() => devLogin(userId)),
    isLoggingIn: mutation.isPending,
    errorMessage: mutation.isError ? formatLoginError(mutation.error) : undefined,
    resetError: mutation.reset,
  }
}
