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

/** Los roles que emite el auth-service en el claim `role` del JWT. */
export type SessionRole = 'CLIENT' | 'ORGANIZER' | 'ADMIN' | 'ACCESS_STAFF'

export type SessionClaims = {
  userId: number
  role: SessionRole
  organizationId?: number
}

type TokenPayload = { sub: string; role: SessionRole; organizationId?: number }

/**
 * Lee el rol y la organización del token guardado. No lo verifica: eso lo hace el gateway en cada
 * request, y acá solo decide qué mostrar.
 */
export function getSessionClaims(): SessionClaims | undefined {
  const token = getAccessToken()
  const encodedPayload = token?.split('.')[1]
  if (!encodedPayload) return undefined
  try {
    const json = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(json) as TokenPayload
    return {
      userId: Number(payload.sub),
      role: payload.role,
      organizationId: payload.organizationId,
    }
  } catch {
    return undefined
  }
}
