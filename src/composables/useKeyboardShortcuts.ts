/**
 * Composable for handling keyboard shortcuts
 */
import { onMounted, onUnmounted } from 'vue'
import { useSubscriptionStore } from '@/stores/subscription'
import type { SubscriptionLevel } from '@/types/subscription'

export function useKeyboardShortcuts() {
  const subscriptionStore = useSubscriptionStore()

  const handleKeydown = (event: KeyboardEvent) => {
    // Check for Ctrl+1, Ctrl+2, Ctrl+3 (also works with Cmd on Mac)
    if ((event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey) {
      switch (event.key) {
        case '1':
          event.preventDefault()
          subscriptionStore.setLevel(1)
          break
        case '2':
          event.preventDefault()
          subscriptionStore.setLevel(2)
          break
        case '3':
          event.preventDefault()
          subscriptionStore.setLevel(3)
          break
      }
    }
  }

  const setupKeyboardShortcuts = () => {
    document.addEventListener('keydown', handleKeydown)
  }

  const removeKeyboardShortcuts = () => {
    document.removeEventListener('keydown', handleKeydown)
  }

  // Auto-setup and cleanup when used in a component
  onMounted(() => {
    setupKeyboardShortcuts()
  })

  onUnmounted(() => {
    removeKeyboardShortcuts()
  })

  return {
    setupKeyboardShortcuts,
    removeKeyboardShortcuts
  }
}

/**
 * Standalone function to manually set subscription level
 * Useful for testing or manual control
 */
export function setSubscriptionLevel(level: SubscriptionLevel) {
  const subscriptionStore = useSubscriptionStore()
  subscriptionStore.setLevel(level)
}
