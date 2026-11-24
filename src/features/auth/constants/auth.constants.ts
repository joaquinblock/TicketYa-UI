import type { SessionRole } from '@/shared/lib/session'

/**
 * Cuentas del `AuthSeeder` del backend, una por rol. Sin client id de Google, el botón de Google
 * las ofrece para elegir y entra con dev-login (perfil `dev` del auth-service).
 */
export const TEST_ACCOUNTS = [
  { userId: 1, email: 'client@ticketya.com', role: 'Cliente' },
  { userId: 2, email: 'organizer@ticketya.com', role: 'Organizador' },
  { userId: 3, email: 'admin@ticketya.com', role: 'Administrador' },
  { userId: 4, email: 'staff@ticketya.com', role: 'Personal de acceso' },
] as const

/** El mismo `GOOGLE_CLIENT_ID` del backend (no es secreto). Sin él, se usan las cuentas de prueba. */
export const GOOGLE_CLIENT_ID = import.meta.env.TICKETYA_GOOGLE_CLIENT_ID

export const GOOGLE_IDENTITY_SCRIPT_URL = 'https://accounts.google.com/gsi/client'

/** Ancho del botón de Google: el del modal (420 px) menos su padding. */
export const GOOGLE_BUTTON_WIDTH_PX = 352

/** Al ingresar, estos roles van directo a su backoffice en vez de quedarse en la tienda. */
export const BACKOFFICE_LOGIN_ROLES = [
  'ADMIN',
  'ORGANIZER',
] as const satisfies readonly SessionRole[]
