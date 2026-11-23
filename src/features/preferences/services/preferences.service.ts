import { apiClient } from '@/shared/lib/http/apiClient'
import { getAccessToken, saveAccessToken } from '@/shared/lib/session'
import type { Participant } from '@/shared/types/event.types'
import { PREFERENCES_SEEDER_CLIENT_USER_ID } from '../constants/preferences.constants'
import type { Preferences } from '../types/preferences.types'

const PREFERENCES_ME_ENDPOINT = '/api/preferences/me'
const PARTICIPANTS_ENDPOINT = '/api/participants'
const DEV_LOGIN_ENDPOINT = '/api/auth/dev-login'

/** En desarrollo, autentica al cliente del seeder si todavía no hay sesión iniciada. */
export async function ensureDevClientSession(): Promise<void> {
  if (!import.meta.env.DEV || getAccessToken()) return
  const { accessToken } = await apiClient.post<{ accessToken: string }>(DEV_LOGIN_ENDPOINT, {
    userId: PREFERENCES_SEEDER_CLIENT_USER_ID,
  })
  saveAccessToken(accessToken)
}

/** Trae las preferencias guardadas del cliente autenticado. */
export function getMyPreferences(): Promise<Preferences> {
  return apiClient.get<Preferences>(PREFERENCES_ME_ENDPOINT)
}

/** Reemplaza las preferencias del cliente autenticado. */
export function updateMyPreferences(preferences: Preferences): Promise<Preferences> {
  return apiClient.put<Preferences>(PREFERENCES_ME_ENDPOINT, preferences)
}

/** Lista los participantes disponibles para elegir como favoritos. */
export function getParticipants(name?: string): Promise<Participant[]> {
  return apiClient.get<Participant[]>(
    PARTICIPANTS_ENDPOINT,
    name ? { params: { name } } : undefined,
  )
}
