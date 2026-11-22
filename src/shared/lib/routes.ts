type EventId = number | string

export const ROUTES = {
  home: '/',
  event: (eventId: EventId) => `/eventos/${eventId}`,
  queue: (eventId: EventId) => `/eventos/${eventId}/fila`,
  seats: (eventId: EventId) => `/eventos/${eventId}/lugares`,
  payment: (eventId: EventId) => `/eventos/${eventId}/pago`,
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
