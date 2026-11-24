import { useQuery } from '@tanstack/react-query'
import { useSyncExternalStore } from 'react'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/routes'
import { getSessionClaims, onSessionChange } from '@/shared/lib/session'
import { ACCESS_STAFF_ROLE } from '../../constants/access.constants'
import { accessKeys } from '../../lib/access.queryKeys'
import { getAccessUser } from '../../services/access.service'

function readRoleSnapshot(): string {
  return getSessionClaims()?.role ?? ''
}

/** Quién entra a la puerta y en qué pestaña de la barra inferior está. */
export function useAccessLayout() {
  const role = useSyncExternalStore(onSessionChange, readRoleSnapshot)
  const { pathname } = useLocation()
  const isAccessStaff = role === ACCESS_STAFF_ROLE

  const userQuery = useQuery({
    queryKey: accessKeys.user(),
    queryFn: getAccessUser,
    enabled: isAccessStaff,
  })

  return {
    isLoggedIn: role !== '',
    isAccessStaff,
    firstName: userQuery.data?.firstName,
    isScanTab: pathname.startsWith(ROUTES.access.scan),
  }
}
