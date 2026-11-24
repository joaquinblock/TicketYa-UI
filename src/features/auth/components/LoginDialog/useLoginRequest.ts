import { useEffect, useRef, useState } from 'react'
import { onLoginRequested } from '@/shared/lib/loginRequest'

type OnLoggedIn = () => void

/** Abre el modal cuando una pantalla pide sesión y recuerda qué retomar al entrar. */
export function useLoginRequest() {
  const [isOpen, setIsOpen] = useState(false)
  const pendingActionRef = useRef<OnLoggedIn | undefined>(undefined)

  useEffect(
    () =>
      onLoginRequested((onLoggedIn) => {
        pendingActionRef.current = onLoggedIn
        setIsOpen(true)
      }),
    [],
  )

  const close = () => {
    pendingActionRef.current = undefined
    setIsOpen(false)
  }

  const completeLogin = () => {
    const pendingAction = pendingActionRef.current
    close()
    pendingAction?.()
  }

  return { isOpen, close, completeLogin }
}
