import { useEffect } from 'react'
import { requestLogin } from '@/shared/lib/loginRequest'

/** Al llegar a una pantalla que pide sesión sin tenerla, abre el login una vez. */
export function useRequestLoginOnMount() {
  useEffect(() => {
    requestLogin()
  }, [])

  return { openLogin: () => requestLogin() }
}
