import { useEffect, useRef } from 'react'
import { GOOGLE_BUTTON_WIDTH_PX, GOOGLE_IDENTITY_SCRIPT_URL } from '../../constants/auth.constants'
import type { GoogleIdentity } from '../../types/google.types'

let googleIdentityPromise: Promise<GoogleIdentity> | undefined

/**
 * Dibuja el botón oficial de Google en el contenedor. Al elegir la cuenta, Google devuelve el ID
 * token, que se canjea en el backend. El script se carga una sola vez, al abrir el login.
 */
export function useGoogleSignIn(clientId: string, onCredential: (idToken: string) => void) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onCredentialRef = useRef(onCredential)
  useEffect(() => {
    onCredentialRef.current = onCredential
  })

  useEffect(() => {
    let isMounted = true
    void loadGoogleIdentity().then((googleIdentity) => {
      if (!isMounted || !containerRef.current) return
      googleIdentity.initialize({
        client_id: clientId,
        callback: ({ credential }) => onCredentialRef.current(credential),
      })
      googleIdentity.renderButton(containerRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: GOOGLE_BUTTON_WIDTH_PX,
        locale: 'es',
      })
    }, forgetFailedLoad)
    return () => {
      isMounted = false
    }
  }, [clientId])

  return { containerRef }
}

/** Sin red o con un bloqueador, el botón no aparece; al reabrir el login se vuelve a intentar. */
function forgetFailedLoad() {
  googleIdentityPromise = undefined
}

function loadGoogleIdentity(): Promise<GoogleIdentity> {
  googleIdentityPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = GOOGLE_IDENTITY_SCRIPT_URL
    script.async = true
    script.onload = () =>
      window.google ? resolve(window.google.accounts.id) : reject(new Error('Sin Google'))
    script.onerror = () => reject(new Error(`No se pudo cargar ${GOOGLE_IDENTITY_SCRIPT_URL}`))
    document.head.append(script)
  })
  return googleIdentityPromise
}
