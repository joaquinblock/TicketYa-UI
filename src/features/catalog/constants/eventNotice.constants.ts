import type { EventNoticeText, FixedNoticeKind } from '../types/catalog.types'

/** Textos de los avisos del detalle: los del mockup (`Evento.dc.html`), salvo "Este evento ya pasó", que es nuevo. */
export const EVENT_NOTICE_TEXT = {
  HIGH_DEMAND: {
    title: 'Alta demanda · fila virtual',
    message:
      'La venta ya abrió. Entrá a la fila para asegurar tu lugar: te habilitamos por tandas y tenés 10 minutos para reservar.',
  },
  SOLD_OUT: {
    title: 'Entradas agotadas',
    message: 'Si alguien devuelve una entrada, el evento vuelve a estar a la venta.',
  },
  SUSPENDED: {
    title: 'Evento suspendido',
    message: 'El organizador suspendió el evento. Te avisamos por email si se reprograma.',
  },
  CANCELLED: {
    title: 'Evento cancelado',
    message: 'Todas las entradas vendidas se reintegran automáticamente al medio de pago.',
  },
  FINISHED: {
    title: 'Este evento ya pasó',
    message: 'La fecha del evento ya pasó y no se venden más entradas.',
  },
} as const satisfies Record<FixedNoticeKind, EventNoticeText>
