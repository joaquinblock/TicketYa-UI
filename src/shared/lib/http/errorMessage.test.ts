import { describe, expect, it } from 'vitest'
import { ApiError } from './ApiError'
import { getErrorMessage } from './errorMessage'

describe('getErrorMessage', () => {
  it('traduce un error de red a un mensaje entendible', () => {
    const error = new ApiError({ error: 'network_error', message: 'fetch failed', status: 0 })

    expect(getErrorMessage(error)).toMatch(/no pudimos conectarnos/i)
  })

  it('traduce un 503 sin mostrar el código', () => {
    const error = new ApiError({ error: 'service_unavailable', message: 'x', status: 503 })

    expect(getErrorMessage(error)).not.toContain('service_unavailable')
  })

  it('usa el mensaje del backend para un error de negocio sin traducción propia', () => {
    const error = new ApiError({
      error: 'event_not_found',
      message: 'No se encontró el evento con id 7',
      status: 404,
    })

    expect(getErrorMessage(error)).toBe('No se encontró el evento con id 7')
  })

  it('da un mensaje genérico para un error que no viene de la API', () => {
    expect(getErrorMessage(new TypeError('boom'))).toMatch(/algo salió mal/i)
  })
})
