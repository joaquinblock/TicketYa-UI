import type { PaymentEndReason, PaymentMethod } from '../types/payment.types'

export const MAX_PAYMENT_ATTEMPTS = 3
export const SEEDER_CLIENT_USER_ID = 1

export const PAYMENT_METHOD_META = {
  CREDIT_CARD: {
    label: 'Tarjeta de crédito',
    kind: 'card',
  },
  DEBIT_CARD: {
    label: 'Tarjeta de débito',
    kind: 'card',
  },
  ACCOUNT_MONEY: {
    label: 'Dinero en cuenta',
    kind: 'wallet',
  },
} as const satisfies Record<PaymentMethod, { label: string; kind: 'card' | 'wallet' }>

export const PAYMENT_END_COPY = {
  EXPIRED: {
    title: 'Se venció tu reserva',
    description:
      'Pasaron los 10 minutos sin pago confirmado y liberamos los lugares. No se te cobró nada.',
  },
  WINDOW_CLOSED: {
    title: 'Cerró la ventana de pago',
    description:
      'Quedaba menos de un minuto para el vencimiento y ya no podemos iniciar un nuevo cobro. Volvé a elegir tus lugares.',
  },
  REJECTED: {
    title: 'El pago se rechazó 3 veces',
    description:
      'Cancelamos la orden y liberamos los lugares. Podés volver a elegirlos si siguen libres.',
  },
  ABANDONED: {
    title: 'Abandonaste la reserva',
    description: 'Liberamos tus lugares para que otra persona pueda comprarlos.',
  },
} as const satisfies Record<PaymentEndReason, { title: string; description: string }>
