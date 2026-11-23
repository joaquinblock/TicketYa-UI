import { ApiError } from '@/shared/lib/http/ApiError'

export type QueueErrorInfo = {
  title: string
  description: string
  canRetry: boolean
}

const BUSINESS_ERRORS: Record<string, { title: string; description: string }> = {
  event_not_found: {
    title: 'No encontramos este evento',
    description: 'El evento no existe o ya no está disponible.',
  },
  event_not_high_demand: {
    title: 'Este evento no tiene fila virtual',
    description: 'Podés ir directo al detalle del evento para elegir tus lugares.',
  },
  sale_not_started: {
    title: 'La venta todavía no empezó',
    description: 'Volvé al detalle del evento para ver el horario de apertura.',
  },
}

export function classifyQueueError(error: unknown): QueueErrorInfo {
  if (error instanceof ApiError && error.code in BUSINESS_ERRORS) {
    return { ...BUSINESS_ERRORS[error.code], canRetry: false }
  }
  return {
    title: 'No pudimos conectarnos con la fila',
    description: 'Ocurrió un problema temporal. Intentá de nuevo en unos segundos.',
    canRetry: true,
  }
}
