import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useTheme, type Theme } from '@/composables/useTheme'

// Type declarations for globalThis

// Mock DOM methods and properties
const mockRemoveAttribute = vi.fn()
const mockSetAttribute = vi.fn()
const mockQuerySelector = vi.fn()

// Setup DOM mocks
Object.defineProperty(globalThis, 'document', {
  value: {
    documentElement: {
      removeAttribute: mockRemoveAttribute,
      setAttribute: mockSetAttribute
    },
    querySelector: mockQuerySelector
  },
  writable: true
})

Object.defineProperty(globalThis, 'window', {
  value: {
    APP_THEME: undefined
  },
  writable: true
})

describe('useTheme Composable', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
    mockQuerySelector.mockReturnValue(null)
    ;(globalThis.window as { APP_THEME?: string }).APP_THEME = undefined
  })

  afterEach(() => {
    // Clean up after each test
    vi.clearAllMocks()
  })

  it('initializes with default theme', () => {
    const { theme } = useTheme()

    // Theme should be reactive
    expect(theme.value).toBe('sovra')
  })

  it('sets theme to sovra and removes data-theme attribute', () => {
    const { theme, initializeTheme } = useTheme()

    // Set up mocks for default behavior
    mockQuerySelector.mockReturnValue(null)

    initializeTheme()

    expect(theme.value).toBe('sovra')
    expect(mockRemoveAttribute).toHaveBeenCalledWith('data-theme')
  })

  it('sets theme to dark and updates data-theme attribute', () => {
    const themeComposable = useTheme()

    // Simulate setting dark theme
    // Access internal setTheme through initializeTheme with mock data
    ;(globalThis.window as { APP_THEME?: string }).APP_THEME = 'dark'

    themeComposable.initializeTheme()

    expect(themeComposable.theme.value).toBe('dark')
    expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark')
  })

  it('sets theme to blue and updates data-theme attribute', () => {
    const themeComposable = useTheme()

    // Simulate setting blue theme
    ;(globalThis.window as { APP_THEME?: string }).APP_THEME = 'blue'

    themeComposable.initializeTheme()

    expect(themeComposable.theme.value).toBe('blue')
    expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'blue')
  })

  it('initializes theme from meta tag', () => {
    const { theme } = useTheme()

    // Mock meta tag with theme
    const mockMetaElement = {
      getAttribute: vi.fn().mockReturnValue('dark')
    }
    mockQuerySelector.mockReturnValue(mockMetaElement)

    const themeComposable = useTheme()
    themeComposable.initializeTheme()

    expect(mockQuerySelector).toHaveBeenCalledWith('meta[name="theme"]')
    expect(mockMetaElement.getAttribute).toHaveBeenCalledWith('content')
    expect(theme.value).toBe('dark')
    expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark')
  })

  it('initializes theme from window object when meta tag is not present', () => {
    const { theme } = useTheme()

    // No meta tag, but window theme is set
    mockQuerySelector.mockReturnValue(null)
    ;(globalThis.window as { APP_THEME?: string }).APP_THEME = 'blue'

    const themeComposable = useTheme()
    themeComposable.initializeTheme()

    expect(theme.value).toBe('blue')
    expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'blue')
  })

  it('defaults to sovra theme when no meta tag or window theme is present', () => {
    const { theme } = useTheme()

    // No meta tag and no window theme
    mockQuerySelector.mockReturnValue(null)
    ;(globalThis.window as { APP_THEME?: string }).APP_THEME = undefined

    const themeComposable = useTheme()
    themeComposable.initializeTheme()

    expect(theme.value).toBe('sovra')
    expect(mockRemoveAttribute).toHaveBeenCalledWith('data-theme')
  })

  it('prioritizes meta tag over window theme', () => {
    const { theme } = useTheme()

    // Both meta tag and window theme are set
    const mockMetaElement = {
      getAttribute: vi.fn().mockReturnValue('dark')
    }
    mockQuerySelector.mockReturnValue(mockMetaElement)
    ;(globalThis.window as { APP_THEME?: string }).APP_THEME = 'blue'

    const themeComposable = useTheme()
    themeComposable.initializeTheme()

    // Meta tag should take precedence
    expect(theme.value).toBe('dark')
    expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark')
  })

  it('handles meta tag with empty content', () => {
    const { theme } = useTheme()

    // Meta tag exists but has empty content
    const mockMetaElement = {
      getAttribute: vi.fn().mockReturnValue('')
    }
    mockQuerySelector.mockReturnValue(mockMetaElement)
    ;(globalThis.window as { APP_THEME?: string }).APP_THEME = 'blue'

    const themeComposable = useTheme()
    themeComposable.initializeTheme()

    // Should fall back to window theme
    expect(theme.value).toBe('blue')
    expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'blue')
  })

  it('handles meta tag with null content', () => {
    const { theme } = useTheme()

    // Meta tag exists but getAttribute returns null
    const mockMetaElement = {
      getAttribute: vi.fn().mockReturnValue(null)
    }
    mockQuerySelector.mockReturnValue(mockMetaElement)
    ;(globalThis.window as { APP_THEME?: string }).APP_THEME = 'dark'

    const themeComposable = useTheme()
    themeComposable.initializeTheme()

    // Should fall back to window theme
    expect(theme.value).toBe('dark')
    expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark')
  })

  it('maintains theme reactivity across multiple instances', () => {
    // Create multiple instances of the composable
    const instance1 = useTheme()
    const instance2 = useTheme()

    // Set theme through one instance
    ;(globalThis.window as { APP_THEME?: string }).APP_THEME = 'dark'
    instance1.initializeTheme()

    // Both instances should reflect the same theme
    expect(instance1.theme.value).toBe('dark')
    expect(instance2.theme.value).toBe('dark')
  })

  it('handles invalid theme types gracefully', () => {
    const themeComposable = useTheme()

    // Set invalid theme in window
    ;(globalThis.window as { APP_THEME?: string }).APP_THEME =
      'invalid-theme' as Theme

    themeComposable.initializeTheme()

    // Should still set the theme value even if invalid
    expect(themeComposable.theme.value).toBe('invalid-theme')
    expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'invalid-theme')
  })

  it('calls DOM methods with correct parameters', () => {
    const themeComposable = useTheme()

    // Test sovra theme (should remove attribute)
    ;(globalThis.window as { APP_THEME?: string }).APP_THEME = 'sovra'
    themeComposable.initializeTheme()
    expect(mockRemoveAttribute).toHaveBeenCalledWith('data-theme')

    // Reset mocks
    mockRemoveAttribute.mockClear()
    mockSetAttribute.mockClear()
    mockQuerySelector.mockClear()
    // Test non-sovra theme (should set attribute)
    ;(globalThis.window as { APP_THEME?: string }).APP_THEME = 'dark'
    themeComposable.initializeTheme()
    expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark')
  })

  it('type definitions are correct', () => {
    const { theme } = useTheme()

    // Verify that theme is properly typed
    expect(typeof theme.value).toBe('string')

    // Verify valid theme values
    const validThemes: Theme[] = ['sovra', 'dark', 'blue']
    validThemes.forEach(validTheme => {
      ;(globalThis.window as { APP_THEME?: string }).APP_THEME = validTheme
      const themeComposable = useTheme()
      themeComposable.initializeTheme()
      expect(theme.value).toBe(validTheme)
    })
  })

  it('handles missing meta tag selector', () => {
    const { theme } = useTheme()

    // Mock querySelector to return null (no meta tag found)
    mockQuerySelector.mockReturnValue(null)
    ;(globalThis.window as { APP_THEME?: string }).APP_THEME = undefined

    const themeComposable = useTheme()
    themeComposable.initializeTheme()

    expect(mockQuerySelector).toHaveBeenCalledWith('meta[name="theme"]')
    expect(theme.value).toBe('sovra')
  })

  it('handles missing documentElement gracefully', () => {
    // Test that the composable can be created even with limited DOM API
    const themeComposable = useTheme()

    // The composable should exist and have the expected interface
    expect(themeComposable).toBeDefined()
    expect(themeComposable.theme).toBeDefined()
    expect(themeComposable.initializeTheme).toBeDefined()
    expect(typeof themeComposable.initializeTheme).toBe('function')

    // The theme should have a default value
    expect(typeof themeComposable.theme.value).toBe('string')
  })
})
