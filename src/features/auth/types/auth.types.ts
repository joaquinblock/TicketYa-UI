/** Respuesta de `POST /api/auth/google` y `POST /api/auth/dev-login`. */
export type AccessTokenResponse = {
  accessToken: string
  tokenType: 'Bearer'
  expiresIn: number
}

/** `GET /api/users/me`: quién es el usuario del token. */
export type CurrentUser = {
  userId: number
  email: string
  firstName: string
  lastName: string
}

/** Un canje de credenciales por el JWT de TicketYa: con Google o, en desarrollo, con dev-login. */
export type TokenExchange = () => Promise<AccessTokenResponse>
