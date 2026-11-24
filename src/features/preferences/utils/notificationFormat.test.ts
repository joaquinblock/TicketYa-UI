import { describe, expect, it } from 'vitest'
import { formatNotificationTime } from './notificationFormat'

const NOW = new Date('2026-11-23T21:00:00Z')

describe('formatNotificationTime', () => {
  it('cuenta en minutos lo de la última hora, con un mínimo de 1', () => {
    expect(formatNotificationTime('2026-11-23T20:55:00Z', NOW)).toBe('hace 5 minutos')
    expect(formatNotificationTime('2026-11-23T21:00:00Z', NOW)).toBe('hace 1 minuto')
  })

  it('cuenta en horas lo del último día', () => {
    expect(formatNotificationTime('2026-11-23T19:00:00Z', NOW)).toBe('hace 2 horas')
  })

  it('cuenta en días lo anterior', () => {
    expect(formatNotificationTime('2026-11-20T21:00:00Z', NOW)).toBe('hace 3 días')
  })
})
