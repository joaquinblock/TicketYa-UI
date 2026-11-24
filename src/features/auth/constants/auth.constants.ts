/** Usuarios del `AuthSeeder` del backend, para entrar con dev-login en desarrollo. */
export const DEV_LOGIN_USERS = [
  { userId: 1, label: 'Cliente' },
  { userId: 2, label: 'Organizador' },
  { userId: 3, label: 'Administrador' },
  { userId: 4, label: 'Personal de acceso' },
] as const

export type DevLoginUserId = (typeof DEV_LOGIN_USERS)[number]['userId']

export const DEFAULT_DEV_LOGIN_USER_ID = 1 satisfies DevLoginUserId

/** El mismo `GOOGLE_CLIENT_ID` del backend (no es secreto). Sin él, no hay botón de Google. */
export const GOOGLE_CLIENT_ID = import.meta.env.TICKETYA_GOOGLE_CLIENT_ID

/** El login sin Google solo existe con el perfil `dev` del auth-service. */
export const IS_DEV_LOGIN_ENABLED = import.meta.env.DEV

export const GOOGLE_IDENTITY_SCRIPT_URL = 'https://accounts.google.com/gsi/client'

/** Ancho del botón de Google: el del modal (420 px) menos su padding. */
export const GOOGLE_BUTTON_WIDTH_PX = 352
