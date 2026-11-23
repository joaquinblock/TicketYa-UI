export const QUEUE_STATUSES = ['WAITING', 'ENABLED', 'EXPIRED'] as const

export type QueueStatus = (typeof QUEUE_STATUSES)[number]

export type QueueEntry = {
  status: QueueStatus
  position: number | null
  queueToken: string | null
  enabledUntil: string | null
}
