import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

const ENV_PREFIX = 'TICKETYA_'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, ENV_PREFIX)

  return {
    plugins: [react(), tailwindcss()],
    envPrefix: ENV_PREFIX,
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      port: Number(env.TICKETYA_DEV_PORT),
      proxy: {
        '/api': env.TICKETYA_GATEWAY_URL,
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      // En los tests no hay proxy de Vite: la API se llama directo al gateway.
      env: { TICKETYA_API_BASE_URL: env.TICKETYA_GATEWAY_URL },
      testTimeout: 15_000,
    },
  }
})
