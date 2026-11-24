import { apiClient } from '@/shared/lib/http/apiClient'
import type { BackofficeUser, Organization } from '../types/backoffice.types'

export function getOrganization(organizationId: number): Promise<Organization> {
  return apiClient.get<Organization>(`/api/organizations/${organizationId}`)
}

/** Nombre y email del usuario del token, para el sidebar y el perfil del topbar. */
export function getBackofficeUser(): Promise<BackofficeUser> {
  return apiClient.get<BackofficeUser>('/api/users/me')
}
