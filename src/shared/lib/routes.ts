type EventId = number | string

export const ROUTES = {
  home: '/',
  event: (eventId: EventId) => `/eventos/${eventId}`,
  queue: (eventId: EventId) => `/eventos/${eventId}/fila`,
  seats: (eventId: EventId) => `/eventos/${eventId}/lugares`,
  payment: (eventId: EventId) => `/eventos/${eventId}/pago`,
  /** Pago de una reserva recién creada: Pago la pide por `orderId`. */
  orderPayment: (eventId: EventId, orderId: number) =>
    `/eventos/${eventId}/pago?orderId=${orderId}`,
  /** Sin página hasta #8. */
  login: '/ingresar',
  myTickets: '/mis-entradas',
  preferences: '/preferencias',
} as const

/** Patrones para el router, derivados de las mismas rutas. */
export const ROUTE_PATTERNS = {
  event: ROUTES.event(':eventId'),
  queue: ROUTES.queue(':eventId'),
  seats: ROUTES.seats(':eventId'),
  payment: ROUTES.payment(':eventId'),
} as const
