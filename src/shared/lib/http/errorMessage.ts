import { ApiError, CLIENT_ERROR_CODE } from './ApiError'

const GENERIC_MESSAGE = 'Algo salió mal. Probá de nuevo en un rato.'

/** Mensajes para errores que no son de una feature. Cada feature traduce los suyos. */
const MESSAGE_BY_CODE: Record<string, string> = {
  [CLIENT_ERROR_CODE.NETWORK]:
    'No pudimos conectarnos con TicketYa. Revisá tu conexión y probá de nuevo.',
  [CLIENT_ERROR_CODE.TIMEOUT]: 'TicketYa está tardando en responder. Probá de nuevo en un rato.',
  [CLIENT_ERROR_CODE.UNEXPECTED_RESPONSE]: GENERIC_MESSAGE,
  service_unavailable:
    'El servicio no está disponible en este momento. Probá de nuevo en unos minutos.',
  internal_error: GENERIC_MESSAGE,
  unauthorized: 'Tu sesión venció. Ingresá de nuevo.',
  forbidden: 'No tenés permiso para hacer esto.',
}

/** El backend ya responde sus errores de negocio en español: si no hay uno propio, se usa el suyo. */
export function getErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return GENERIC_MESSAGE
  return MESSAGE_BY_CODE[error.code] ?? error.message
}
