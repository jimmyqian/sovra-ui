/**
 * Focus tracking utilities for accessibility testing
 */

/* eslint-disable @typescript-eslint/no-non-null-assertion */

export interface FocusEvent {
  element: HTMLElement | null
  timestamp: number
  type: 'focus' | 'blur'
}

/**
 * Utility class for tracking focus changes during tests
 */
export class FocusTracker {
  private focusHistory: FocusEvent[] = []
  private originalFocus: HTMLElement | null = null
  private isTracking = false

  /**
   * Start tracking focus changes
   */
  startTracking(): void {
    if (this.isTracking) return

    this.originalFocus = document.activeElement as HTMLElement
    this.focusHistory = []
    this.isTracking = true

    document.addEventListener('focusin', this.handleFocusIn)
    document.addEventListener('focusout', this.handleFocusOut)
  }

  /**
   * Stop tracking focus changes
   */
  stopTracking(): void {
    if (!this.isTracking) return

    this.isTracking = false
    document.removeEventListener('focusin', this.handleFocusIn)
    document.removeEventListener('focusout', this.handleFocusOut)
  }

  /**
   * Get the focus history
   */
  getFocusHistory(): FocusEvent[] {
    return [...this.focusHistory]
  }

  /**
   * Get the currently focused element
   */
  getCurrentFocus(): HTMLElement | null {
    return document.activeElement as HTMLElement
  }

  /**
   * Get the original focus before tracking started
   */
  getOriginalFocus(): HTMLElement | null {
    return this.originalFocus
  }

  /**
   * Clear focus history
   */
  clearHistory(): void {
    this.focusHistory = []
  }

  /**
   * Check if focus is trapped within a container
   */
  isFocusTrappedIn(container: HTMLElement): boolean {
    const currentFocus = this.getCurrentFocus()
    return currentFocus ? container.contains(currentFocus) : false
  }

  /**
   * Get all focusable elements within a container
   */
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      '[contenteditable="true"]'
    ].join(', ')

    return Array.from(container.querySelectorAll(focusableSelectors)).filter(
      el => this.isElementVisible(el as HTMLElement)
    ) as HTMLElement[]
  }

  /**
   * Get the tab order of focusable elements
   */
  getTabOrder(container: HTMLElement): HTMLElement[] {
    const focusableElements = this.getFocusableElements(container)

    return focusableElements.sort((a, b) => {
      const aTabIndex = parseInt(a.getAttribute('tabindex') ?? '0')
      const bTabIndex = parseInt(b.getAttribute('tabindex') ?? '0')

      // Elements with tabindex > 0 come first, in order
      if (aTabIndex > 0 && bTabIndex > 0) {
        return aTabIndex - bTabIndex
      }

      // Elements with tabindex > 0 come before tabindex = 0
      if (aTabIndex > 0 && bTabIndex === 0) return -1
      if (aTabIndex === 0 && bTabIndex > 0) return 1

      // For elements with tabindex = 0, preserve DOM order
      return 0
    })
  }

  /**
   * Simulate tab navigation through focusable elements
   */
  simulateTabNavigation(
    container: HTMLElement,
    reverse = false
  ): HTMLElement | null {
    const focusableElements = this.getTabOrder(container)
    const currentIndex = focusableElements.indexOf(this.getCurrentFocus()!)

    let nextIndex: number
    if (reverse) {
      nextIndex =
        currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1
    } else {
      nextIndex =
        currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1
    }

    const nextElement = focusableElements[nextIndex]
    if (nextElement) {
      nextElement.focus()
      return nextElement
    }

    return null
  }

  private handleFocusIn = (event: FocusEvent): void => {
    this.focusHistory.push({
      element: event.target as HTMLElement,
      timestamp: Date.now(),
      type: 'focus'
    })
  }

  private handleFocusOut = (event: FocusEvent): void => {
    this.focusHistory.push({
      element: event.target as HTMLElement,
      timestamp: Date.now(),
      type: 'blur'
    })
  }

  private isElementVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element)
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      element.offsetWidth > 0 &&
      element.offsetHeight > 0
    )
  }
}

/**
 * Create a focus tracker instance for testing
 */
export function createFocusTracker(): FocusTracker {
  return new FocusTracker()
}
