import { describe, expect, it } from 'vitest'
import { ApiError, CLIENT_ERROR_CODE } from '@/shared/lib/http/ApiError'
import { isPreferencesForbiddenError } from './preferencesErrors'

describe('isPreferencesForbiddenError', () => {
  it.each([
    [401, 'unauthorized', true],
    [403, 'forbidden', true],
    [500, 'internal_error', false],
    [503, 'service_unavailable', false],
    [0, CLIENT_ERROR_CODE.NETWORK, false],
  ])('status %i (%s) devuelve %s', (status, code, expected) => {
    expect(isPreferencesForbiddenError(new ApiError({ error: code, message: code, status }))).toBe(
      expected,
    )
  })

  it('devuelve false para errores que no son ApiError', () => {
    expect(isPreferencesForbiddenError(new Error('network'))).toBe(false)
  })
})
