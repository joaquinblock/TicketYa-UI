import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import { failLoudlyWhenGatewayIsDown } from './gateway'

failLoudlyWhenGatewayIsDown()

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.unstubAllEnvs()
})
