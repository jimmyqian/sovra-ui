/**
 * Notification store for managing toast/popup notifications
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message?: string
  duration?: number
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])

  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = Date.now().toString()
    const newNotification: Notification = {
      id,
      duration: 3000, // Default 3 seconds
      ...notification
    }

    notifications.value.push(newNotification)

    // Auto-remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearAll() {
    notifications.value = []
  }

  // Convenience methods for different notification types
  function success(title: string, message?: string, duration?: number) {
    return addNotification({ type: 'success', title, message, duration })
  }

  function info(title: string, message?: string, duration?: number) {
    return addNotification({ type: 'info', title, message, duration })
  }

  function warning(title: string, message?: string, duration?: number) {
    return addNotification({ type: 'warning', title, message, duration })
  }

  function error(title: string, message?: string, duration?: number) {
    return addNotification({ type: 'error', title, message, duration })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    info,
    warning,
    error
  }
})
