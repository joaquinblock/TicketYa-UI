/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly TICKETYA_GATEWAY_URL: string
  /** Vacío en el navegador (usa el proxy de Vite); la URL del gateway en los tests. */
  readonly TICKETYA_API_BASE_URL?: string
  /** Client id de OAuth de Google Cloud. Sin él, el login muestra solo el usuario de prueba. */
  readonly TICKETYA_GOOGLE_CLIENT_ID?: string
}
