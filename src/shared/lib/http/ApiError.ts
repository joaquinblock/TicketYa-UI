/** Códigos que arma el front cuando no hay `ErrorDto` del backend. */
export const CLIENT_ERROR_CODE = {
  NETWORK: 'network_error',
  TIMEOUT: 'timeout',
  UNEXPECTED_RESPONSE: 'unexpected_response',
} as const

/** Forma del `ErrorDto` que devuelven todos los servicios (error-handling.md del backend). */
export type ErrorDto = {
  error: string
  message: string
  status: number
  detail?: Record<string, unknown>
}

export class ApiError extends Error {
  readonly code: string
  readonly status: number
  readonly detail?: Record<string, unknown>

  constructor({ error, message, status, detail }: ErrorDto, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ApiError'
    this.code = error
    this.status = status
    this.detail = detail
  }
}

const HTTP_UNAUTHORIZED = 401

/** El gateway no reconoce la sesión: falta el token o venció. */
export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.status === HTTP_UNAUTHORIZED
}
