import { ApiError } from '@/shared/lib/http/ApiError'

const LOGIN_ERROR_MESSAGE_BY_CODE: Partial<Record<string, string>> = {
  invalid_credentials: 'No pudimos verificar tu cuenta de Google. Probá de nuevo.',
  user_disabled: 'Tu cuenta está dada de baja.',
  data_conflict: 'Tu email ya está vinculado a otra cuenta de Google.',
}

/** Un 503, la red o cualquier otro error: no es culpa del usuario y se puede reintentar. */
const LOGIN_FAILED_MESSAGE = 'No pudimos iniciar sesión. Probá de nuevo en unos minutos.'

export function formatLoginError(error: unknown): string {
  if (!(error instanceof ApiError)) return LOGIN_FAILED_MESSAGE
  return LOGIN_ERROR_MESSAGE_BY_CODE[error.code] ?? LOGIN_FAILED_MESSAGE
}
