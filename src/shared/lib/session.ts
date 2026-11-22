const ACCESS_TOKEN_KEY = 'ticketya.accessToken'

type SessionExpiredListener = () => void

const sessionExpiredListeners = new Set<SessionExpiredListener>()

export function getAccessToken(): string | undefined {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? undefined
}

export function saveAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

/** Cierra la sesión porque el gateway rechazó el token, y avisa a quien quiera reaccionar. */
export function expireSession() {
  clearAccessToken()
  sessionExpiredListeners.forEach((listener) => listener())
}

export function onSessionExpired(listener: SessionExpiredListener): () => void {
  sessionExpiredListeners.add(listener)
  return () => sessionExpiredListeners.delete(listener)
}
