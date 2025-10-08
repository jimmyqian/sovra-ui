/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'
import type { Connect } from 'vite'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const basicAuthMiddleware: Connect.NextHandleFunction = (req, res, next) => {
  // Skip auth if disabled via env var
  if (process.env.VITE_DISABLE_AUTH === 'true') {
    console.log('[AUTH] Auth disabled via VITE_DISABLE_AUTH')
    return next()
  }

  // Get credentials from environment variables
  const username = process.env.VITE_AUTH_USER
  const password = process.env.VITE_AUTH_PASS

  console.log('[AUTH] Checking credentials:', {
    hasUsername: !!username,
    hasPassword: !!password,
    username: username ? `${username.substring(0, 3)}...` : 'undefined'
  })

  // If no credentials configured, skip auth
  if (!username || !password) {
    console.log('[AUTH] No credentials configured, skipping auth')
    return next()
  }

  const credentials = Buffer.from(`${username}:${password}`).toString('base64')
  const auth = req.headers.authorization

  if (auth === `Basic ${credentials}`) {
    console.log('[AUTH] Valid credentials provided')
    return next()
  }

  console.log('[AUTH] Requesting authentication')
  res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"')
  res.statusCode = 401
  return res.end('Unauthorized')
}

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'basic-auth',
      configureServer(server) {
        server.middlewares.use(basicAuthMiddleware)
      },
      configurePreviewServer(server) {
        server.middlewares.use(basicAuthMiddleware)
      }
    },
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
      },
      configurePreviewServer(server) {
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
    port: 3000,
    host: true, // Listen on all network interfaces
    strictPort: false // Allow fallback to another port if 3000 is taken
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
