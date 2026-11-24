import { apiClient } from '@/shared/lib/http/apiClient'
import type { Participant } from '@/shared/types/event.types'
import type { Preferences } from '../types/preferences.types'

const PREFERENCES_ME_ENDPOINT = '/api/preferences/me'
const PARTICIPANTS_ENDPOINT = '/api/participants'

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
