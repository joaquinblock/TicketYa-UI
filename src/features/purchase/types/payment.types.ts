export const PAYMENT_METHODS = ['CREDIT_CARD', 'DEBIT_CARD', 'ACCOUNT_MONEY'] as const

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED' | 'REJECTED' | 'FAILED'

export type OrderTicketStatus = 'RESERVED' | 'ISSUED' | 'USED' | 'VOIDED' | 'REFUNDED'

export type OrderEventSummary = {
  name: string
  dateTime: string
  venueName: string
  venueAddress: string
  venueCity: string
}

export type OrderTicket = {
  id: number
  eventSectorId: number
  sectorName: string
  seatId: number | null
  row: string | null
  number: number | null
  price: number
  status: OrderTicketStatus
  qrCode: string | null
}

export type Order = {
  id: number
  eventId: number
  event: OrderEventSummary
  status: OrderStatus
  expiresAt: string
  total: number
  paymentMethod: PaymentMethod | null
  tickets: OrderTicket[]
}

export type PayOrderPayload = {
  paymentMethod: PaymentMethod
  idempotencyKey: string
}

export type OrderTicketLine = {
  key: string
  label: string
  subtotal: number
}

export type PaymentEndReason = 'EXPIRED' | 'WINDOW_CLOSED' | 'REJECTED' | 'ABANDONED'
