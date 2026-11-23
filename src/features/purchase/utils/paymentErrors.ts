import { ApiError, CLIENT_ERROR_CODE } from '@/shared/lib/http/ApiError'
import type { PaymentEndReason } from '../types/payment.types'

export type PayErrorOutcome =
  | { kind: 'rejected'; reason: string; rejectedAttempts: number }
  | { kind: 'no_answer' }
  | { kind: 'ended'; endReason: PaymentEndReason }
  | { kind: 'message'; message: string }

const NO_ANSWER_CODES = new Set<string>([
  'service_unavailable',
  CLIENT_ERROR_CODE.NETWORK,
  CLIENT_ERROR_CODE.TIMEOUT,
])

const ENDED_REASON_BY_CODE: Record<string, PaymentEndReason> = {
  reservation_expired: 'EXPIRED',
  payment_window_closed: 'WINDOW_CLOSED',
  order_not_payable: 'REJECTED',
}

const PAY_MESSAGE_BY_CODE: Record<string, string> = {
  payment_in_progress:
    'Ya hay un pago en curso para esta orden. Esperá un momento y volvé a intentar.',
  purchase_failed:
    'No pudimos emitir las entradas. Si se realizó algún cobro, se reintegrará automáticamente.',
}

const CANCEL_MESSAGE_BY_CODE: Record<string, string> = {
  payment_in_progress: 'Hay un pago en curso. Esperá a que termine antes de abandonar la reserva.',
  reservation_expired: 'La reserva ya se venció y sus lugares fueron liberados.',
}

/** Traduce un error de `POST /api/orders/{id}/pay` al estado que debe mostrar la pantalla. */
export function classifyPayError(error: unknown): PayErrorOutcome {
  if (!(error instanceof ApiError)) {
    return { kind: 'message', message: 'No pudimos procesar el pago. Intentá nuevamente.' }
  }

  if (error.code === 'payment_rejected') {
    const reason =
      typeof error.detail?.reason === 'string' ? error.detail.reason : 'Fondos insuficientes'
    const rejectedAttempts =
      typeof error.detail?.rejectedAttempts === 'number' ? error.detail.rejectedAttempts : 1
    return { kind: 'rejected', reason, rejectedAttempts }
  }

  if (NO_ANSWER_CODES.has(error.code)) {
    return { kind: 'no_answer' }
  }

  if (error.code in ENDED_REASON_BY_CODE) {
    return { kind: 'ended', endReason: ENDED_REASON_BY_CODE[error.code] }
  }

  return {
    kind: 'message',
    message: PAY_MESSAGE_BY_CODE[error.code] ?? 'No pudimos procesar el pago. Intentá nuevamente.',
  }
}

/** Traduce un error de `POST /api/orders/{id}/cancel` a un mensaje legible para el cliente. */
export function getCancelErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.code in CANCEL_MESSAGE_BY_CODE) {
    return CANCEL_MESSAGE_BY_CODE[error.code]
  }
  return 'No pudimos abandonar la reserva. Intentá nuevamente.'
}
