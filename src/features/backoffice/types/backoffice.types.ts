import type { LucideIcon } from 'lucide-react'
import type { SessionRole } from '@/shared/lib/session'

/** Los roles que usan el backoffice con sidebar. El personal de acceso tiene su propio layout. */
export type BackofficeRole = Extract<SessionRole, 'ADMIN' | 'ORGANIZER'>

export type BackofficeSection =
  | 'home'
  | 'refunds'
  | 'events'
  | 'createEvent'
  | 'report'
  | 'accessStaff'
  | 'venues'
  | 'participants'
  | 'usersAndOrganizations'
  | 'settings'

export type BackofficeSectionMeta = {
  label: string
  path: string
  icon: LucideIcon
  description: string
}

export type BackofficeRoleMeta = {
  label: string
  kicker: string
  /** Sin título propio, el inicio se titula con el nombre de la organización. */
  homeTitle?: string
  homeDescription: string
  sections: readonly BackofficeSection[]
}

export type Organization = {
  id: number
  publicName: string
}

export type BackofficeUser = {
  userId: number
  email: string
  firstName: string
  lastName: string
}
