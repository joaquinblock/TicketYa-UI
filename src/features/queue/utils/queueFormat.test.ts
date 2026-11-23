import { describe, expect, it } from 'vitest'
import {
  formatEnabledUntilTime,
  formatEstimatedWait,
  getQueueProgressPercent,
  isTurnExpired,
} from './queueFormat'

describe('queueFormat', () => {
  it('calcula la espera estimada a razón de 100 personas cada 30 segundos', () => {
    expect(formatEstimatedWait(0)).toBe('menos de 1 min')
    expect(formatEstimatedWait(50)).toBe('menos de 1 min')
    expect(formatEstimatedWait(250)).toBe('2 min')
    expect(formatEstimatedWait(1284)).toBe('7 min')
  })

  it('calcula el porcentaje de progreso entre posición inicial y actual', () => {
    expect(getQueueProgressPercent(100, 100)).toBe(0)
    expect(getQueueProgressPercent(100, 40)).toBe(60)
    expect(getQueueProgressPercent(0, 0)).toBe(100)
  })

  it('formatea enabledUntil en HH:MM local y detecta vencimiento', () => {
    const localDate = new Date(2026, 10, 23, 21, 42, 0)
    expect(formatEnabledUntilTime(localDate.toISOString())).toBe('21:42')
    expect(isTurnExpired(localDate.toISOString(), localDate.getTime() - 1000)).toBe(false)
    expect(isTurnExpired(localDate.toISOString(), localDate.getTime())).toBe(true)
  })
})
