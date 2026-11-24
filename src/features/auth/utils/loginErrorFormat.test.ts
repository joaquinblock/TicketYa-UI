import { describe, expect, it } from 'vitest'
import { ApiError, CLIENT_ERROR_CODE } from '@/shared/lib/http/ApiError'
import { formatLoginError } from './loginErrorFormat'

const apiError = (error: string, status: number) => new ApiError({ error, message: error, status })

describe('formatLoginError (CA3)', () => {
  it.each([
    ['invalid_credentials', 401, 'No pudimos verificar tu cuenta de Google. Probá de nuevo.'],
    ['user_disabled', 403, 'Tu cuenta está dada de baja.'],
    ['data_conflict', 409, 'Tu email ya está vinculado a otra cuenta de Google.'],
    ['service_unavailable', 503, 'No pudimos iniciar sesión. Probá de nuevo en unos minutos.'],
    [CLIENT_ERROR_CODE.NETWORK, 0, 'No pudimos iniciar sesión. Probá de nuevo en unos minutos.'],
  ])('%s (%i) muestra "%s"', (code, status, message) => {
    expect(formatLoginError(apiError(code, status))).toBe(message)
  })

  it('un error que no viene del backend se puede reintentar', () => {
    expect(formatLoginError(new Error('boom'))).toBe(
      'No pudimos iniciar sesión. Probá de nuevo en unos minutos.',
    )
  })
})
