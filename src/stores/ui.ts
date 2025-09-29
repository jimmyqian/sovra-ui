/**
 * UI store for managing application UI state
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Theme = 'light' | 'dark'
export type ViewMode = 'grid' | 'list'
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  message: string
  type: NotificationType
  duration: number
}

export const useUIStore = defineStore('ui', () => {
  // State
  const theme = ref<Theme>('light')
  const sidebarOpen = ref<boolean>(false)
  const viewMode = ref<ViewMode>('grid')
  const notifications = ref<Notification[]>([])
  const isLoading = ref<boolean>(false)
  const conversationScrollPosition = ref<number>(0)

  // Getters
  const hasNotifications = computed(() => notifications.value.length > 0)

  const isDarkMode = computed(() => theme.value === 'dark')
  const isGridView = computed(() => viewMode.value === 'grid')
  const isListView = computed(() => viewMode.value === 'list')

  // Actions
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const setSidebarOpen = (open: boolean) => {
    sidebarOpen.value = open
  }

  const setViewMode = (mode: ViewMode) => {
    viewMode.value = mode
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const addNotification = (
    message: string,
    type: NotificationType = 'info',
    duration = 5000
  ) => {
    const id = generateId()
    const notification: Notification = {
      id,
      message,
      type,
      duration
    }

    notifications.value.push(notification)

    // Auto-remove notification after duration (if duration > 0)
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const showSuccess = (message: string) => {
    addNotification(message, 'success')
  }

  const showError = (message: string) => {
    addNotification(message, 'error')
  }

  const showWarning = (message: string) => {
    addNotification(message, 'warning')
  }

  const showInfo = (message: string) => {
    addNotification(message, 'info')
  }

  const saveConversationScrollPosition = (position: number) => {
    conversationScrollPosition.value = position
  }

  const getConversationScrollPosition = (): number => {
    return conversationScrollPosition.value
  }

  const resetConversationScrollPosition = () => {
    conversationScrollPosition.value = 0
  }

  // Helper functions
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  return {
    // State
    theme,
    sidebarOpen,
    viewMode,
    notifications,
    isLoading,
    conversationScrollPosition,

    // Getters
    hasNotifications,
    isDarkMode,
    isGridView,
    isListView,

    // Actions
    setTheme,
    toggleTheme,
    toggleSidebar,
    setSidebarOpen,
    setViewMode,
    setLoading,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    saveConversationScrollPosition,
    getConversationScrollPosition,
    resetConversationScrollPosition
  }
})
