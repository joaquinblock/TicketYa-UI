import { useRef } from 'react'
import { useDialogFocus } from './useDialogFocus'
import { useLogin } from './useLogin'
import { useLoginRequest } from './useLoginRequest'

/** Une el pedido de login, el canje del token y el foco del modal. */
export function useLoginDialogController() {
  const dialogRef = useRef<HTMLDivElement>(null)
  const request = useLoginRequest()
  const { resetError, ...login } = useLogin(request.completeLogin)

  // Mientras canjea no se cierra: el token llegaría con el modal cerrado y sin retomar nada.
  const close = () => {
    if (login.isLoggingIn) return
    resetError()
    request.close()
  }

  useDialogFocus({ dialogRef, isOpen: request.isOpen, onClose: close })

  return { dialogRef, isOpen: request.isOpen, close, ...login }
}
