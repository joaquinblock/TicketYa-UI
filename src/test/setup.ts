import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { failLoudlyWhenGatewayIsDown } from './gateway'

failLoudlyWhenGatewayIsDown()

afterEach(cleanup)
