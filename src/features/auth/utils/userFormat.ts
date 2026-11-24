import type { CurrentUser } from '../types/auth.types'

type UserName = Pick<CurrentUser, 'firstName' | 'lastName'>

export function formatFullName({ firstName, lastName }: UserName): string {
  return `${firstName} ${lastName}`
}

/** Para el avatar del header: "Juan Pérez" → "JP". */
export function formatInitials({ firstName, lastName }: UserName): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}
