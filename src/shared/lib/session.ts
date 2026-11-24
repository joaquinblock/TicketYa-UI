const ACCESS_TOKEN_KEY = 'ticketya.accessToken'

type SessionListener = () => void

const sessionChangeListeners = new Set<SessionListener>()

export function getAccessToken(): string | undefined {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? undefined
}

export function saveAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
  notifySessionChange()
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  notifySessionChange()
}

/** Cierra la sesión porque el gateway rechazó el token. */
export function expireSession() {
  clearAccessToken()
}

/** Avisa cada vez que se guarda o se borra el token, para que la UI muestre la sesión actual. */
export function onSessionChange(listener: SessionListener): () => void {
  sessionChangeListeners.add(listener)
  return () => sessionChangeListeners.delete(listener)
}

function notifySessionChange() {
  sessionChangeListeners.forEach((listener) => listener())
}
