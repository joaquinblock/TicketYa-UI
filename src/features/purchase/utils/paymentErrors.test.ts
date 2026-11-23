import { describe, expect, it } from 'vitest'
import { ApiError, CLIENT_ERROR_CODE } from '@/shared/lib/http/ApiError'
import { classifyPayError, getCancelErrorMessage } from './paymentErrors'

describe('paymentErrors', () => {
  it('clasifica 422 payment_rejected con motivo e intentos rechazados', () => {
    const err = new ApiError({
      error: 'payment_rejected',
      message: 'El pago fue rechazado: Fondos insuficientes',
      status: 422,
      detail: { reason: 'Fondos insuficientes', rejectedAttempts: 2 },
    })
    expect(classifyPayError(err)).toEqual({
      kind: 'rejected',
      reason: 'Fondos insuficientes',
      rejectedAttempts: 2,
    })
  })

  it('clasifica 503 y errores de red/timeout como pasarela sin respuesta', () => {
    const unavailable = new ApiError({
      error: 'service_unavailable',
      message: 'Sin respuesta',
      status: 503,
    })
    const network = new ApiError({
      error: CLIENT_ERROR_CODE.NETWORK,
      message: 'Sin conexión',
      status: 0,
    })
    expect(classifyPayError(unavailable)).toEqual({ kind: 'no_answer' })
    expect(classifyPayError(network)).toEqual({ kind: 'no_answer' })
  })

  it('clasifica reservation_expired, payment_window_closed y order_not_payable como orden finalizada', () => {
    expect(
      classifyPayError(
        new ApiError({ error: 'reservation_expired', message: 'Expirada', status: 409 }),
      ),
    ).toEqual({ kind: 'ended', endReason: 'EXPIRED' })

    expect(
      classifyPayError(
        new ApiError({ error: 'payment_window_closed', message: 'Cerrada', status: 409 }),
      ),
    ).toEqual({ kind: 'ended', endReason: 'WINDOW_CLOSED' })

    expect(
      classifyPayError(
        new ApiError({ error: 'order_not_payable', message: 'No pagable', status: 409 }),
      ),
    ).toEqual({ kind: 'ended', endReason: 'REJECTED' })
  })

  it('traduce errores de cancelación a mensajes claros en español', () => {
    const inProgress = new ApiError({
      error: 'payment_in_progress',
      message: 'En curso',
      status: 409,
    })
    expect(getCancelErrorMessage(inProgress)).toContain('pago en curso')
    expect(getCancelErrorMessage(new Error('desconocido'))).toContain('No pudimos abandonar')
  })
})
