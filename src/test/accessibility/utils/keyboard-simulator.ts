/**
 * Keyboard event simulation utilities for accessibility testing
 */

export interface KeyboardEventOptions {
  key: string
  code?: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  bubbles?: boolean
  cancelable?: boolean
  preventDefault?: boolean
}

/**
 * Utility class for simulating keyboard events in tests
 */
export class KeyboardSimulator {
  /**
   * Create a keyboard event with proper options
   */
  static createKeyboardEvent(
    type: 'keydown' | 'keyup' | 'keypress',
    options: KeyboardEventOptions
  ): KeyboardEvent {
    const {
      key,
      code = key,
      ctrlKey = false,
      shiftKey = false,
      altKey = false,
      metaKey = false,
      bubbles = true,
      cancelable = true
    } = options

    return new KeyboardEvent(type, {
      key,
      code,
      ctrlKey,
      shiftKey,
      altKey,
      metaKey,
      bubbles,
      cancelable
    })
  }

  /**
   * Simulate a key press (keydown + keyup)
   */
  static async simulateKeyPress(
    element: HTMLElement,
    options: KeyboardEventOptions
  ): Promise<boolean> {
    const keydownEvent = this.createKeyboardEvent('keydown', options)
    const keyupEvent = this.createKeyboardEvent('keyup', options)

    element.dispatchEvent(keydownEvent)

    // Small delay to simulate realistic timing
    await new Promise(resolve => setTimeout(resolve, 10))

    const keyupResult = element.dispatchEvent(keyupEvent)

    return !keydownEvent.defaultPrevented && keyupResult
  }

  /**
   * Simulate Tab key navigation
   */
  static async simulateTab(
    element: HTMLElement,
    shiftKey = false
  ): Promise<boolean> {
    return this.simulateKeyPress(element, {
      key: 'Tab',
      code: 'Tab',
      shiftKey
    })
  }

  /**
   * Simulate Enter key activation
   */
  static async simulateEnter(element: HTMLElement): Promise<boolean> {
    return this.simulateKeyPress(element, {
      key: 'Enter',
      code: 'Enter'
    })
  }

  /**
   * Simulate Space key activation
   */
  static async simulateSpace(element: HTMLElement): Promise<boolean> {
    return this.simulateKeyPress(element, {
      key: ' ',
      code: 'Space'
    })
  }

  /**
   * Simulate Escape key
   */
  static async simulateEscape(element: HTMLElement): Promise<boolean> {
    return this.simulateKeyPress(element, {
      key: 'Escape',
      code: 'Escape'
    })
  }

  /**
   * Simulate Arrow key navigation
   */
  static async simulateArrowKey(
    element: HTMLElement,
    direction: 'up' | 'down' | 'left' | 'right'
  ): Promise<boolean> {
    const keyMap = {
      up: { key: 'ArrowUp', code: 'ArrowUp' },
      down: { key: 'ArrowDown', code: 'ArrowDown' },
      left: { key: 'ArrowLeft', code: 'ArrowLeft' },
      right: { key: 'ArrowRight', code: 'ArrowRight' }
    }

    return this.simulateKeyPress(element, keyMap[direction])
  }

  /**
   * Simulate typing text
   */
  static async simulateTyping(
    element: HTMLInputElement | HTMLTextAreaElement,
    text: string
  ): Promise<void> {
    element.focus()

    for (const char of text) {
      await this.simulateKeyPress(element, { key: char })

      // Update the input value
      element.value += char
      element.dispatchEvent(new Event('input', { bubbles: true }))

      // Small delay between characters
      await new Promise(resolve => setTimeout(resolve, 5))
    }
  }

  /**
   * Simulate common keyboard shortcuts
   */
  static async simulateShortcut(
    element: HTMLElement,
    shortcut: 'copy' | 'paste' | 'cut' | 'selectAll' | 'undo' | 'redo'
  ): Promise<boolean> {
    const shortcuts = {
      copy: { key: 'c', ctrlKey: true },
      paste: { key: 'v', ctrlKey: true },
      cut: { key: 'x', ctrlKey: true },
      selectAll: { key: 'a', ctrlKey: true },
      undo: { key: 'z', ctrlKey: true },
      redo: { key: 'y', ctrlKey: true }
    }

    return this.simulateKeyPress(element, shortcuts[shortcut])
  }

  /**
   * Test if an element responds to keyboard activation
   */
  static async testKeyboardActivation(element: HTMLElement): Promise<{
    respondsToEnter: boolean
    respondsToSpace: boolean
  }> {
    let enterActivated = false
    let spaceActivated = false

    const handleClick = () => {
      if (document.activeElement === element) {
        enterActivated = true
        spaceActivated = true
      }
    }

    element.addEventListener('click', handleClick)

    // Test Enter key
    element.focus()
    await this.simulateEnter(element)
    const enterResult = enterActivated

    // Reset and test Space key
    enterActivated = false
    element.focus()
    await this.simulateSpace(element)
    const spaceResult = spaceActivated

    element.removeEventListener('click', handleClick)

    return {
      respondsToEnter: enterResult,
      respondsToSpace: spaceResult
    }
  }

  /**
   * Test tab navigation sequence through elements
   */
  static async testTabSequence(
    elements: HTMLElement[]
  ): Promise<HTMLElement[]> {
    if (elements.length === 0) return []

    const sequence: HTMLElement[] = []

    // Start with first element
    elements[0]!.focus()
    sequence.push(document.activeElement as HTMLElement)

    // Tab through remaining elements
    for (let i = 0; i < elements.length - 1; i++) {
      await this.simulateTab(document.activeElement as HTMLElement)
      const focused = document.activeElement as HTMLElement
      if (focused && elements.includes(focused)) {
        sequence.push(focused)
      }
    }

    return sequence
  }
}
