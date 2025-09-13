import { ref, computed } from 'vue'

export type Theme = 'sovra' | 'dark' | 'blue'

const currentTheme = ref<Theme>('sovra')

export const useTheme = () => {
  const theme = computed(() => currentTheme.value)

  const setTheme = (newTheme: Theme) => {
    currentTheme.value = newTheme

    // Update the data-theme attribute on the document element
    if (newTheme === 'sovra') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  }

  const initializeTheme = () => {
    // Get theme from server/environment (e.g., from meta tag, window object, or API)
    // Check for server-provided theme in meta tag
    const metaTheme = document
      .querySelector('meta[name="theme"]')
      ?.getAttribute('content') as Theme

    // Check for theme in window object (set by server)
    const windowTheme = (window as { APP_THEME?: string }).APP_THEME as Theme

    // Use server-provided theme or default to 'sovra'
    const serverTheme = metaTheme || windowTheme || 'sovra'

    setTheme(serverTheme)
  }

  return {
    theme,
    initializeTheme
  }
}
