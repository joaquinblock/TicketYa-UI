import { useQuery } from '@tanstack/react-query'
import { useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestLogin } from '@/shared/lib/loginRequest'
import { ROUTES } from '@/shared/lib/routes'
import { clearAccessToken, getAccessToken, onSessionChange } from '@/shared/lib/session'
import { authKeys } from '../../lib/auth.queryKeys'
import { getCurrentUser } from '../../services/auth.service'

function hasAccessToken() {
  return getAccessToken() !== undefined
}

/** Quién está logueado según el token guardado, y las acciones de entrar y salir. */
export function useSessionMenu() {
  const navigate = useNavigate()
  const isLoggedIn = useSyncExternalStore(onSessionChange, hasAccessToken)
  const { data: user } = useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: getCurrentUser,
    enabled: isLoggedIn,
  })

  const logout = () => {
    clearAccessToken()
    navigate(ROUTES.home)
  }

  return { user: isLoggedIn ? user : undefined, isLoggedIn, logout, login: () => requestLogin() }
}
