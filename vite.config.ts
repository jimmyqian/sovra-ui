/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
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
