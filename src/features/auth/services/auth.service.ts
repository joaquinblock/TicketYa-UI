import { apiClient } from '@/shared/lib/http/apiClient'
import type { AccessTokenResponse, CurrentUser } from '../types/auth.types'

export function loginWithGoogle(idToken: string): Promise<AccessTokenResponse> {
  return apiClient.post<AccessTokenResponse>('/api/auth/google', { idToken })
}

/** Solo existe con el perfil `dev` del auth-service. */
export function devLogin(userId: number): Promise<AccessTokenResponse> {
  return apiClient.post<AccessTokenResponse>('/api/auth/dev-login', { userId })
}

export function getCurrentUser(): Promise<CurrentUser> {
  return apiClient.get<CurrentUser>('/api/users/me')
}
