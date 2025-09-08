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

    // Save theme preference to localStorage
    localStorage.setItem('theme', newTheme)
  }

  const initializeTheme = () => {
    // Load theme from localStorage or default to 'sovra'
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'sovra'
    setTheme(savedTheme)
  }

  const toggleTheme = () => {
    const themes: Theme[] = ['sovra', 'dark', 'blue']
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  return {
    theme,
    setTheme,
    initializeTheme,
    toggleTheme
  }
}
