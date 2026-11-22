import { configureApiClient } from '@/shared/lib/http/apiClient'
import { expireSession, getAccessToken } from '@/shared/lib/session'

/** En el navegador la API va por el proxy de Vite (mismo origen); en los tests, directo al gateway. */
export function setupApiClient() {
  configureApiClient({
    baseUrl: import.meta.env.TICKETYA_API_BASE_URL || window.location.origin,
    getAccessToken,
    onUnauthorized: expireSession,
  })
}
