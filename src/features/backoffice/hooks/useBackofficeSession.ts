import { useQuery } from '@tanstack/react-query'
import { useSyncExternalStore } from 'react'
import { getSessionClaims, onSessionChange } from '@/shared/lib/session'
import { ADMIN_ORGANIZATION_NAME, BACKOFFICE_ROLES } from '../constants/backoffice.constants'
import { backofficeKeys } from '../lib/backoffice.queryKeys'
import { getBackofficeUser, getOrganization } from '../services/backoffice.service'
import type { BackofficeRole } from '../types/backoffice.types'

function readClaimsSnapshot(): string {
  return JSON.stringify(getSessionClaims() ?? null)
}

function isBackofficeRole(role: string | undefined): role is BackofficeRole {
  return BACKOFFICE_ROLES.some((backofficeRole) => backofficeRole === role)
}

/** Quién está en el backoffice: su rol y organización (del token), su nombre y el de la organización. */
export function useBackofficeSession() {
  const claimsSnapshot = useSyncExternalStore(onSessionChange, readClaimsSnapshot)
  const claims = getSessionClaims()
  const role = isBackofficeRole(claims?.role) ? claims.role : undefined
  const organizationId = claims?.organizationId ?? null

  const userQuery = useQuery({
    queryKey: [...backofficeKeys.user(), claimsSnapshot],
    queryFn: getBackofficeUser,
    enabled: Boolean(role),
  })
  const organizationQuery = useQuery({
    queryKey: backofficeKeys.organization(organizationId),
    queryFn: () => {
      if (organizationId == null) throw new Error('useBackofficeSession: falta organizationId')
      return getOrganization(organizationId)
    },
    enabled: role === 'ORGANIZER' && organizationId != null,
  })

  return {
    isLoggedIn: Boolean(claims),
    role,
    user: userQuery.data,
    organizationName:
      role === 'ADMIN' ? ADMIN_ORGANIZATION_NAME : (organizationQuery.data?.publicName ?? ''),
  }
}
