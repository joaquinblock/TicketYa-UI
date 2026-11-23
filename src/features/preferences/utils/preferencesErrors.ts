import { ApiError } from '@/shared/lib/http/ApiError'

const HTTP_UNAUTHORIZED = 401
const HTTP_FORBIDDEN = 403

/** Indica si el error corresponde a falta de sesión o a un usuario sin rol de cliente. */
export function isPreferencesForbiddenError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.status === HTTP_UNAUTHORIZED || error.status === HTTP_FORBIDDEN)
  )
}
