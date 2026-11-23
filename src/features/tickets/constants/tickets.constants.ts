import type { BadgeProps } from '@/shared/components/atoms/Badge'
import type { PaymentMethod, TicketStatus } from '../types/tickets.types'

export const SEEDER_CLIENT_USER_ID = 1

export const MONTH_ABBREVIATIONS = [
  'ENE',
  'FEB',
  'MAR',
  'ABR',
  'MAY',
  'JUN',
  'JUL',
  'AGO',
  'SEP',
  'OCT',
  'NOV',
  'DIC',
] as const

export const WEEKDAY_NAMES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
] as const

export const PAYMENT_METHOD_LABEL = {
  CREDIT_CARD: 'Tarjeta de crédito',
  DEBIT_CARD: 'Tarjeta de débito',
  ACCOUNT_MONEY: 'Dinero en cuenta',
} as const satisfies Record<PaymentMethod, string>

type TicketStatusMeta = {
  label: string
  tone: NonNullable<BadgeProps['tone']>
  title: string
  description: string
}

export const TICKET_STATUS_META = {
  ISSUED: {
    label: 'Emitida',
    tone: 'success',
    title: 'Tu entrada está lista',
    description:
      'Mostrá este código en la puerta desde el celular, no hace falta imprimirlo. Sirve para entrar una sola vez.',
  },
  USED: {
    label: 'Usada',
    tone: 'neutral',
    title: 'Ya ingresaste con esta entrada',
    description: 'El código ya se escaneó en el ingreso y no vuelve a servir.',
  },
  REFUNDED: {
    label: 'Reintegrada',
    tone: 'info',
    title: 'Te devolvimos el dinero',
    description: 'Reintegramos el dinero al medio de pago original y liberamos el lugar.',
  },
  VOIDED: {
    label: 'Anulada',
    tone: 'error',
    title: 'Entrada anulada',
    description: 'Esta entrada fue anulada y ya no sirve para ingresar.',
  },
  RESERVED: {
    label: 'Reservada',
    tone: 'warning',
    title: 'Entrada reservada',
    description: 'Esta entrada todavía está pendiente de emisión.',
  },
} as const satisfies Record<TicketStatus, TicketStatusMeta>

export const PENDING_RETURN_TICKET_META: TicketStatusMeta = {
  label: 'Devolución pendiente',
  tone: 'warning',
  title: 'Estamos revisando tu devolución',
  description:
    'Un administrador está revisando tu pedido. Mientras tanto, este QR no sirve para entrar.',
}
