import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/routes'
import { getSessionClaims } from '@/shared/lib/session'
import { ACCESS_PANEL_ROLE, BACKOFFICE_LOGIN_ROLES } from '../../constants/auth.constants'
import { useDialogFocus } from './useDialogFocus'
import { useLogin } from './useLogin'
import { useLoginRequest } from './useLoginRequest'

/** Une el pedido de login, el canje del token y el foco del modal. */
export function useLoginDialogController() {
  const dialogRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const request = useLoginRequest()

  const completeLogin = () => {
    request.completeLogin()
    const role = getSessionClaims()?.role
    if (BACKOFFICE_LOGIN_ROLES.some((backofficeRole) => backofficeRole === role)) {
      navigate(ROUTES.backoffice.home)
    } else if (role === ACCESS_PANEL_ROLE) {
      navigate(ROUTES.access.home)
    }
  }

  const { resetError, ...login } = useLogin(completeLogin)

  // Mientras canjea no se cierra: el token llegaría con el modal cerrado y sin retomar nada.
  const close = () => {
    if (login.isLoggingIn) return
    resetError()
    request.close()
  }

  useDialogFocus({ dialogRef, isOpen: request.isOpen, onClose: close })

  return { dialogRef, isOpen: request.isOpen, close, ...login }
}
