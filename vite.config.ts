import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

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
  }
})
