import { describe, expect, it, vi } from 'vitest'
import { getAccessToken, saveAccessToken } from '@/shared/lib/session'
import { devLogin, SEEDER_USER } from '@/test/gateway'
import { apiRequest } from './apiClient'
import { ApiError } from './ApiError'

type EventPage = { content: { id: number; name: string }[] }

const UNREACHABLE_URL = 'http://localhost:9'
const NONEXISTENT_EVENT_ID = 999_999

describe('apiRequest', () => {
  it('devuelve los datos del gateway', async () => {
    const page = await apiRequest<EventPage>('/api/events?size=1')

    expect(page.content).toHaveLength(1)
  })

  it('convierte el ErrorDto del backend en un ApiError con su código', async () => {
    const request = apiRequest(`/api/events/${NONEXISTENT_EVENT_ID}`)

    await expect(request).rejects.toMatchObject({ code: 'event_not_found', status: 404 })
  })

  it('manda el token de la sesión', async () => {
    saveAccessToken(await devLogin(SEEDER_USER.CLIENT))

    const orders = await apiRequest<unknown[]>('/api/orders')

    expect(Array.isArray(orders)).toBe(true)
  })

  it('cierra la sesión cuando el gateway rechaza el token', async () => {
    saveAccessToken('token.adulterado.invalido')

    await expect(apiRequest('/api/orders')).rejects.toMatchObject({ code: 'unauthorized' })
    expect(getAccessToken()).toBeUndefined()
  })

  it('convierte una falla de red en un ApiError de red', async () => {
    vi.stubEnv('TICKETYA_API_BASE_URL', UNREACHABLE_URL)

    const request = apiRequest('/api/events')

    await expect(request).rejects.toBeInstanceOf(ApiError)
    await expect(request).rejects.toMatchObject({ code: 'network_error' })
  })
})
