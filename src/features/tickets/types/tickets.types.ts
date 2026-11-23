export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED'

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'ACCOUNT_MONEY'

export type TicketStatus = 'RESERVED' | 'ISSUED' | 'USED' | 'VOIDED' | 'REFUNDED'

export type OrderEvent = {
  name: string
  dateTime: string
  venueName: string
  venueAddress: string
  venueCity: string
}

export type Ticket = {
  id: number
  eventSectorId: number
  sectorName: string
  seatId: number | null
  row: string | null
  number: number | null
  price: number
  status: TicketStatus
  qrCode: string | null
}

export type Order = {
  id: number
  eventId: number
  event: OrderEvent
  status: OrderStatus
  expiresAt: string
  total: number
  paymentMethod: PaymentMethod | null
  tickets: Ticket[]
}
