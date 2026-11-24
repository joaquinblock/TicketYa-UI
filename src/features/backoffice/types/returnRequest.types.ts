export type ReturnRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'

/** Una solicitud de devolución, como la devuelve `GET /api/return-requests`. */
export type ReturnRequest = {
  id: number
  ticketId: number
  eventId: number
  requestedBy: number
  requestedAt: string
  status: ReturnRequestStatus
  resolvedBy: number | null
  resolvedAt: string | null
}

export type ReturnRequestPage = {
  content: ReturnRequest[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type ReturnRequestFilter = ReturnRequestStatus | 'ALL'

export type ReturnRequestResolution = 'approve' | 'reject'
