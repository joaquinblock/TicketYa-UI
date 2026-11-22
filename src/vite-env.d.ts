/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly TICKETYA_GATEWAY_URL: string
  /** Vacío en el navegador (usa el proxy de Vite); la URL del gateway en los tests. */
  readonly TICKETYA_API_BASE_URL?: string
}
