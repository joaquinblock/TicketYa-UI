const GATEWAY_URL = import.meta.env.TICKETYA_GATEWAY_URL

/** Usuarios que carga el `AuthSeeder` del backend. */
export const SEEDER_USER = {
  CLIENT: 1,
  ORGANIZER: 2,
  ADMIN: 3,
  ACCESS_STAFF: 4,
} as const

type SeederUserId = (typeof SEEDER_USER)[keyof typeof SEEDER_USER]

export class GatewayUnavailableError extends Error {
  constructor(cause: unknown) {
    super(
      `No se pudo conectar con el gateway en ${GATEWAY_URL}. ` +
        'Levantá el backend con el perfil dev del auth-service (README de TicketYa → Cómo ejecutarlo).',
      { cause },
    )
  }
}

/** Cambia el "fetch failed" mudo de Node por un error que dice qué falta levantar. */
export function failLoudlyWhenGatewayIsDown() {
  const nativeFetch = globalThis.fetch
  globalThis.fetch = async (...args: Parameters<typeof fetch>) => {
    try {
      return await nativeFetch(...args)
    } catch (error) {
      throw new GatewayUnavailableError(error)
    }
  }
}

export async function devLogin(userId: SeederUserId): Promise<string> {
  const response = await fetch(`${GATEWAY_URL}/api/auth/dev-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })
  if (!response.ok) {
    throw new Error(
      `dev-login respondió ${response.status}: ¿el auth-service corre con el perfil dev?`,
    )
  }
  const { accessToken } = (await response.json()) as { accessToken: string }
  return accessToken
}
