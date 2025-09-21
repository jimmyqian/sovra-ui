/**
 * Unit tests for the UI store
 * Tests theme management, sidebar state, notifications, and view modes
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUIStore } from '../ui'

describe('UI Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useUIStore()

      expect(store.theme).toBe('light')
      expect(store.sidebarOpen).toBe(false)
      expect(store.notifications).toEqual([])
      expect(store.viewMode).toBe('grid')
      expect(store.isLoading).toBe(false)
    })
  })

  describe('Theme Management', () => {
    it('should toggle theme from light to dark', () => {
      const store = useUIStore()

      store.toggleTheme()

      expect(store.theme).toBe('dark')
    })

    it('should toggle theme from dark to light', () => {
      const store = useUIStore()

      store.setTheme('dark')
      store.toggleTheme()

      expect(store.theme).toBe('light')
    })

    it('should set specific theme', () => {
      const store = useUIStore()

      store.setTheme('dark')
      expect(store.theme).toBe('dark')

      store.setTheme('light')
      expect(store.theme).toBe('light')
    })

    it('should compute isDarkMode correctly', () => {
      const store = useUIStore()

      expect(store.isDarkMode).toBe(false)

      store.setTheme('dark')
      expect(store.isDarkMode).toBe(true)
    })
  })

  describe('Sidebar Management', () => {
    it('should toggle sidebar state', () => {
      const store = useUIStore()

      store.toggleSidebar()
      expect(store.sidebarOpen).toBe(true)

      store.toggleSidebar()
      expect(store.sidebarOpen).toBe(false)
    })

    it('should set sidebar state explicitly', () => {
      const store = useUIStore()

      store.setSidebarOpen(true)
      expect(store.sidebarOpen).toBe(true)

      store.setSidebarOpen(false)
      expect(store.sidebarOpen).toBe(false)
    })
  })

  describe('Notification Management', () => {
    it('should add notification with default values', () => {
      const store = useUIStore()
      const message = 'Test notification'

      store.addNotification(message)

      expect(store.notifications).toHaveLength(1)
      expect(store.notifications[0]).toMatchObject({
        message,
        type: 'info',
        duration: 5000
      })
      expect(store.notifications[0]?.id).toBeDefined()
    })

    it('should add notification with custom type and duration', () => {
      const store = useUIStore()
      const message = 'Error notification'

      store.addNotification(message, 'error', 10000)

      expect(store.notifications).toHaveLength(1)
      expect(store.notifications[0]).toMatchObject({
        message,
        type: 'error',
        duration: 10000
      })
    })

    it('should remove notification by id', () => {
      const store = useUIStore()

      store.addNotification('Test 1')
      store.addNotification('Test 2')

      expect(store.notifications).toHaveLength(2)

      const firstId = store.notifications[0]?.id
      if (firstId) {
        store.removeNotification(firstId)
      }

      expect(store.notifications).toHaveLength(1)
      expect(store.notifications[0]?.message).toBe('Test 2')
    })

    it('should auto-remove notification after duration', async () => {
      const store = useUIStore()

      store.addNotification('Auto-remove test', 'info', 1000)

      expect(store.notifications).toHaveLength(1)

      vi.advanceTimersByTime(1000)
      await vi.runAllTimersAsync()

      expect(store.notifications).toHaveLength(0)
    })

    it('should not auto-remove notification with duration 0', async () => {
      const store = useUIStore()

      store.addNotification('Persistent notification', 'info', 0)

      expect(store.notifications).toHaveLength(1)

      vi.advanceTimersByTime(10000)
      await vi.runAllTimersAsync()

      expect(store.notifications).toHaveLength(1)
    })

    it('should clear all notifications', () => {
      const store = useUIStore()

      store.addNotification('Test 1')
      store.addNotification('Test 2')
      store.addNotification('Test 3')

      expect(store.notifications).toHaveLength(3)

      store.clearNotifications()

      expect(store.notifications).toHaveLength(0)
    })

    it('should compute hasNotifications correctly', () => {
      const store = useUIStore()

      expect(store.hasNotifications).toBe(false)

      store.addNotification('Test')
      expect(store.hasNotifications).toBe(true)

      store.clearNotifications()
      expect(store.hasNotifications).toBe(false)
    })
  })

  describe('View Mode Management', () => {
    it('should set view mode to list', () => {
      const store = useUIStore()

      store.setViewMode('list')

      expect(store.viewMode).toBe('list')
    })

    it('should set view mode to grid', () => {
      const store = useUIStore()

      store.setViewMode('list')
      store.setViewMode('grid')

      expect(store.viewMode).toBe('grid')
    })

    it('should compute isGridView correctly', () => {
      const store = useUIStore()

      expect(store.isGridView).toBe(true)

      store.setViewMode('list')
      expect(store.isGridView).toBe(false)
    })

    it('should compute isListView correctly', () => {
      const store = useUIStore()

      expect(store.isListView).toBe(false)

      store.setViewMode('list')
      expect(store.isListView).toBe(true)
    })
  })

  describe('Loading State Management', () => {
    it('should set loading state', () => {
      const store = useUIStore()

      store.setLoading(true)
      expect(store.isLoading).toBe(true)

      store.setLoading(false)
      expect(store.isLoading).toBe(false)
    })
  })

  describe('Notification Helpers', () => {
    it('should add success notification', () => {
      const store = useUIStore()
      const message = 'Success message'

      store.showSuccess(message)

      expect(store.notifications).toHaveLength(1)
      expect(store.notifications[0]).toMatchObject({
        message,
        type: 'success'
      })
    })

    it('should add error notification', () => {
      const store = useUIStore()
      const message = 'Error message'

      store.showError(message)

      expect(store.notifications).toHaveLength(1)
      expect(store.notifications[0]).toMatchObject({
        message,
        type: 'error'
      })
    })

    it('should add warning notification', () => {
      const store = useUIStore()
      const message = 'Warning message'

      store.showWarning(message)

      expect(store.notifications).toHaveLength(1)
      expect(store.notifications[0]).toMatchObject({
        message,
        type: 'warning'
      })
    })

    it('should add info notification', () => {
      const store = useUIStore()
      const message = 'Info message'

      store.showInfo(message)

      expect(store.notifications).toHaveLength(1)
      expect(store.notifications[0]).toMatchObject({
        message,
        type: 'info'
      })
    })
  })

  describe('Upsell Popup Management', () => {
    it('should start with popup not shown', () => {
      const store = useUIStore()

      expect(store.hasShownUpsellPopup).toBe(false)
      expect(store.canShowUpsellPopup()).toBe(true)
    })

    it('should mark popup as shown and prevent further displays', () => {
      const store = useUIStore()

      // Initially can show popup
      expect(store.canShowUpsellPopup()).toBe(true)

      // Mark as shown
      store.markUpsellPopupShown()

      // Should now be marked as shown and cannot show again
      expect(store.hasShownUpsellPopup).toBe(true)
      expect(store.canShowUpsellPopup()).toBe(false)
    })

    it('should reset popup state', () => {
      const store = useUIStore()

      // Mark as shown
      store.markUpsellPopupShown()
      expect(store.canShowUpsellPopup()).toBe(false)

      // Reset state
      store.resetUpsellPopupState()

      // Should be able to show again
      expect(store.hasShownUpsellPopup).toBe(false)
      expect(store.canShowUpsellPopup()).toBe(true)
    })

    it('should handle multiple mark attempts correctly', () => {
      const store = useUIStore()

      // Mark multiple times
      store.markUpsellPopupShown()
      store.markUpsellPopupShown()
      store.markUpsellPopupShown()

      // Should still be marked as shown only once
      expect(store.hasShownUpsellPopup).toBe(true)
      expect(store.canShowUpsellPopup()).toBe(false)
    })
  })
})
