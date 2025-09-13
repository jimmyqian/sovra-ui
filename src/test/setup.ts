import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Type declarations for global
declare global {
  interface Window {
    IntersectionObserver: typeof IntersectionObserver
    ResizeObserver: typeof ResizeObserver
  }
}

// Mock IntersectionObserver
interface MockIntersectionObserver {
  observe: ReturnType<typeof vi.fn>
  unobserve: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
}

// Type-safe global IntersectionObserver mock
;(
  globalThis as typeof globalThis & { IntersectionObserver: any }
).IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
})) as unknown as new (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => MockIntersectionObserver

// Mock ResizeObserver
interface MockResizeObserver {
  observe: ReturnType<typeof vi.fn>
  unobserve: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
}

// Type-safe global ResizeObserver mock
;(globalThis as typeof globalThis & { ResizeObserver: any }).ResizeObserver =
  vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  })) as unknown as new (callback: ResizeObserverCallback) => MockResizeObserver

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})
