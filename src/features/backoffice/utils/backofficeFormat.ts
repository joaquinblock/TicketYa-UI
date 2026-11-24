import type { BackofficeUser } from '../types/backoffice.types'

export function formatBackofficeName({ firstName, lastName }: BackofficeUser): string {
  return `${firstName} ${lastName}`
}

export function formatBackofficeInitials({ firstName, lastName }: BackofficeUser): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const REQUESTED_AT_FORMAT = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

/** `19 nov · 16:42`, como la columna "Pedido" del diseño. */
export function formatRequestedAt(requestedAt: string): string {
  const parts = REQUESTED_AT_FORMAT.formatToParts(new Date(requestedAt))
  const valueOf = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''
  return `${valueOf('day')} ${valueOf('month').replace('.', '')} · ${valueOf('hour')}:${valueOf('minute')}`
}
