import { describe, expect, it } from 'vitest'
import { devLogin, SEEDER_USER } from './gateway'

describe('devLogin', () => {
  it('devuelve un JWT para un usuario del seeder', async () => {
    const token = await devLogin(SEEDER_USER.CLIENT)

    expect(token.split('.')).toHaveLength(3)
  })
})
