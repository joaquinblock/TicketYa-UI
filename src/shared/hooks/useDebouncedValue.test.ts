import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from './useDebouncedValue'

const DELAY_MS = 300

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('entrega el valor nuevo recién después de la espera sin cambios, y un cambio en el medio la reinicia', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, DELAY_MS), {
      initialProps: { value: 'se' },
    })

    rerender({ value: 'ser' })
    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('se')

    rerender({ value: 'serr' })
    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('se')

    act(() => vi.advanceTimersByTime(100))
    expect(result.current).toBe('serr')
  })
})
