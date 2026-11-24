import type { BackofficeUser } from '../types/backoffice.types'

export function formatBackofficeName({ firstName, lastName }: BackofficeUser): string {
  return `${firstName} ${lastName}`
}

export function formatBackofficeInitials({ firstName, lastName }: BackofficeUser): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}
