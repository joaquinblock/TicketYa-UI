import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/shared/lib/http/apiClient'
import { getMyPreferences, getParticipants, updateMyPreferences } from './preferences.service'

describe('preferences.service', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('getMyPreferences consulta GET /api/preferences/me', async () => {
    const prefs = { eventTypes: ['CONCERT'], participantIds: [1], city: 'Tandil' }
    const spy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce(prefs)

    const result = await getMyPreferences()

    expect(spy).toHaveBeenCalledWith('/api/preferences/me')
    expect(result).toEqual(prefs)
  })

  it('updateMyPreferences envía PUT /api/preferences/me con el cuerpo completo', async () => {
    const payload = { eventTypes: ['CONCERT', 'THEATER'], participantIds: [1, 2], city: null }
    const spy = vi.spyOn(apiClient, 'put').mockResolvedValueOnce(payload)

    const result = await updateMyPreferences(payload)

    expect(spy).toHaveBeenCalledWith('/api/preferences/me', payload)
    expect(result).toEqual(payload)
  })

  it('getParticipants consulta GET /api/participants con filtro opcional por nombre', async () => {
    const participants = [{ id: 1, name: 'Los Serranos', type: 'ARTIST' }]
    const spy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce(participants)

    await getParticipants()
    expect(spy).toHaveBeenLastCalledWith('/api/participants', undefined)

    await getParticipants('serranos')
    expect(spy).toHaveBeenLastCalledWith('/api/participants', { params: { name: 'serranos' } })
  })
})
