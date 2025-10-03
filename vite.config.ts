/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'ip-logger',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          const timestamp = new Date().toISOString()
          const logEntry = `${timestamp} - ${ip} - ${req.method} ${req.url}\n`
          fs.appendFileSync('access.log', logEntry)
          next()
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        // Ensure all assets are in a single bundle for SPA
        manualChunks: undefined
      }
    }
  },
  base: './', // Use relative paths for SPA deployment
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
})
