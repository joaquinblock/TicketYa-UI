import { describe, expect, it } from 'vitest'
import { getAccessToken, saveAccessToken } from '@/shared/lib/session'
import { devLogin, SEEDER_USER } from '@/test/gateway'
import { apiClient, configureApiClient } from './apiClient'
import { ApiError } from './ApiError'

type EventPage = { content: { id: number; name: string }[] }

const UNREACHABLE_URL = 'http://localhost:9'
const NONEXISTENT_EVENT_ID = 999_999

describe('apiClient', () => {
  it('devuelve los datos del gateway', async () => {
    const page = await apiClient.get<EventPage>('/api/events', { params: { size: 1 } })

    expect(page.content).toHaveLength(1)
  })

  it('convierte el ErrorDto del backend en un ApiError con su código', async () => {
    const request = apiClient.get(`/api/events/${NONEXISTENT_EVENT_ID}`)

    await expect(request).rejects.toMatchObject({ code: 'event_not_found', status: 404 })
  })

  it('manda el token de la sesión', async () => {
    saveAccessToken(await devLogin(SEEDER_USER.CLIENT))

    const orders = await apiClient.get<unknown[]>('/api/orders')

    expect(Array.isArray(orders)).toBe(true)
  })

  it('cierra la sesión cuando el gateway rechaza el token', async () => {
    saveAccessToken('token.adulterado.invalido')

    await expect(apiClient.get('/api/orders')).rejects.toMatchObject({ code: 'unauthorized' })
    expect(getAccessToken()).toBeUndefined()
  })

  it('convierte una falla de red en un ApiError de red', async () => {
    configureApiClient({
      baseUrl: UNREACHABLE_URL,
      getAccessToken: () => undefined,
      onUnauthorized: () => {},
    })

    const request = apiClient.get('/api/events')

    await expect(request).rejects.toBeInstanceOf(ApiError)
    await expect(request).rejects.toMatchObject({ code: 'network_error', status: 0 })
  })
})
