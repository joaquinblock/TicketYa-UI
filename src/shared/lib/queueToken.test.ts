import { beforeEach, describe, expect, it } from 'vitest'
import { clearQueueTurn, getQueueTurn, saveQueueTurn } from './queueToken'

describe('queueToken', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('guarda, lee y limpia el turno por eventId en sessionStorage', () => {
    const future = new Date(Date.now() + 5 * 60_000).toISOString()
    saveQueueTurn(1, { queueToken: 'jwt-123', enabledUntil: future })

    expect(getQueueTurn(1)).toEqual({ queueToken: 'jwt-123', enabledUntil: future })
    expect(getQueueTurn(2)).toBeNull()

    clearQueueTurn(1)
    expect(getQueueTurn(1)).toBeNull()
  })

  it('descarta y limpia el turno si enabledUntil ya venció', () => {
    const past = new Date(Date.now() - 1000).toISOString()
    saveQueueTurn(1, { queueToken: 'jwt-old', enabledUntil: past })

    expect(getQueueTurn(1)).toBeNull()
    expect(sessionStorage.getItem('ticketya.queueToken.1')).toBeNull()
  })
})
