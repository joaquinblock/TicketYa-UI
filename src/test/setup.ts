import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'
import { setupApiClient } from '@/app/setupApiClient'
import { failLoudlyWhenGatewayIsDown } from './gateway'

failLoudlyWhenGatewayIsDown()

beforeEach(() => {
  setupApiClient()
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})
