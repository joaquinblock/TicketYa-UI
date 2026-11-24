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
  myTickets: '/mis-entradas',
  preferences: '/preferencias',
  /** Panel del personal de acceso: eventos asignados y validar entradas. */
  access: {
    home: '/acceso',
    scan: '/acceso/escanear',
    /** Escanear con el evento ya elegido. */
    scanEvent: (eventId: EventId) => `/acceso/escanear?evento=${eventId}`,
  },
  backoffice: {
    home: '/backoffice',
    refunds: '/backoffice/devoluciones',
    events: '/backoffice/eventos',
    createEvent: '/backoffice/eventos/nuevo',
    report: '/backoffice/reporte',
    accessStaff: '/backoffice/personal-de-acceso',
    venues: '/backoffice/lugares',
    participants: '/backoffice/participantes',
    usersAndOrganizations: '/backoffice/usuarios-y-organizaciones',
    settings: '/backoffice/configuracion',
  },
} as const

/** Patrones para el router, derivados de las mismas rutas. */
export const ROUTE_PATTERNS = {
  event: ROUTES.event(':eventId'),
  queue: ROUTES.queue(':eventId'),
  seats: ROUTES.seats(':eventId'),
  payment: ROUTES.payment(':eventId'),
} as const
