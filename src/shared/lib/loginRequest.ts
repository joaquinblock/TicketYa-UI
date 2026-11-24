type OnLoggedIn = () => void
type LoginRequestListener = (onLoggedIn?: OnLoggedIn) => void

const loginRequestListeners = new Set<LoginRequestListener>()

/**
 * Pide abrir el login desde cualquier feature, sin importar la de auth. `onLoggedIn` corre cuando
 * el usuario entra, para retomar lo que estaba haciendo (por ejemplo, reservar).
 */
export function requestLogin(onLoggedIn?: OnLoggedIn) {
  loginRequestListeners.forEach((listener) => listener(onLoggedIn))
}

export function onLoginRequested(listener: LoginRequestListener): () => void {
  loginRequestListeners.add(listener)
  return () => loginRequestListeners.delete(listener)
}
