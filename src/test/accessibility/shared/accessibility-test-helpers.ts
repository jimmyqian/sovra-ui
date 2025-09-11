/**
 * Shared accessibility testing helpers and utilities
 */

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { VueWrapper } from '@vue/test-utils'
import type { ContrastResult } from '../utils/contrast-calculator'
import { ColorContrastCalculator } from '../utils/contrast-calculator'
import { FocusTracker, createFocusTracker } from '../utils/focus-tracker'
import { KeyboardSimulator } from '../utils/keyboard-simulator'

/**
 * ARIA validation results
 */
export interface AriaValidationResult {
  hasRequiredRole: boolean
  hasAccessibleName: boolean
  hasProperLabeling: boolean
  hasProperDescription?: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Accessibility test helper class
 */
export class AccessibilityTestHelper {
  /**
   * Validate ARIA attributes for an element
   */
  static validateAriaAttributes(
    element: HTMLElement,
    expectedRole?: string,
    requiresAccessibleName = true
  ): AriaValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Check role
    const actualRole =
      element.getAttribute('role') ?? element.tagName.toLowerCase()
    const hasRequiredRole = expectedRole ? actualRole === expectedRole : true

    if (expectedRole && !hasRequiredRole) {
      errors.push(`Expected role "${expectedRole}" but found "${actualRole}"`)
    }

    // Check accessible name
    const accessibleName = this.getAccessibleName(element)
    const hasAccessibleName = Boolean(accessibleName)

    if (requiresAccessibleName && !hasAccessibleName) {
      errors.push('Element requires an accessible name but none was found')
    }

    // Check labeling
    const hasProperLabeling = this.hasProperLabeling(element)
    if (!hasProperLabeling) {
      warnings.push('Element may not have proper labeling for screen readers')
    }

    // Check description
    const description = element.getAttribute('aria-describedby')
    const hasProperDescription = Boolean(description)

    return {
      hasRequiredRole,
      hasAccessibleName,
      hasProperLabeling,
      hasProperDescription,
      errors,
      warnings
    }
  }

  /**
   * Get the accessible name of an element
   */
  static getAccessibleName(element: HTMLElement): string {
    // Check aria-label first
    const ariaLabel = element.getAttribute('aria-label')
    if (ariaLabel) return ariaLabel

    // Check aria-labelledby
    const labelledBy = element.getAttribute('aria-labelledby')
    if (labelledBy) {
      const labelElements = labelledBy
        .split(' ')
        .map(id => document.getElementById(id))
        .filter(Boolean)

      if (labelElements.length > 0) {
        return labelElements
          .map(el => el!.textContent || '')
          .join(' ')
          .trim()
      }
    }

    // For form elements, check associated label
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`)
      if (label?.textContent) {
        return label.textContent.trim()
      }
    }

    // Check if wrapped in label
    const parentLabel = element.closest('label')
    if (parentLabel?.textContent) {
      return parentLabel.textContent.trim()
    }

    // For buttons, use text content
    if (element.tagName === 'BUTTON' && element.textContent) {
      return element.textContent.trim()
    }

    // For images, use alt text
    if (element.tagName === 'IMG') {
      return (element as HTMLImageElement).alt
    }

    return ''
  }

  /**
   * Check if element has proper labeling
   */
  static hasProperLabeling(element: HTMLElement): boolean {
    const tagName = element.tagName.toLowerCase()

    // Interactive elements should have accessible names
    const interactiveElements = ['button', 'input', 'textarea', 'select', 'a']
    if (interactiveElements.includes(tagName)) {
      return Boolean(this.getAccessibleName(element))
    }

    // Elements with roles should have accessible names
    const role = element.getAttribute('role')
    if (role) {
      const rolesRequiringNames = [
        'button',
        'link',
        'textbox',
        'checkbox',
        'radio'
      ]
      if (rolesRequiringNames.includes(role)) {
        return Boolean(this.getAccessibleName(element))
      }
    }

    return true
  }

  /**
   * Test keyboard navigation for a component
   */
  static async testKeyboardNavigation(wrapper: VueWrapper<any>): Promise<{
    canFocusWithTab: boolean
    canActivateWithEnter: boolean
    canActivateWithSpace: boolean
    focusableElements: HTMLElement[]
  }> {
    const container = wrapper.element as HTMLElement
    const focusTracker = createFocusTracker()

    focusTracker.startTracking()

    // Get focusable elements
    const focusableElements = focusTracker.getFocusableElements(container)

    // Test tab navigation
    let canFocusWithTab = false
    if (focusableElements.length > 0) {
      await KeyboardSimulator.simulateTab(focusableElements[0])
      canFocusWithTab = focusTracker.getCurrentFocus() !== null
    }

    // Test Enter activation
    let canActivateWithEnter = false
    if (focusableElements.length > 0) {
      const firstFocusable = focusableElements[0]
      const result =
        await KeyboardSimulator.testKeyboardActivation(firstFocusable)
      canActivateWithEnter = result.respondsToEnter
    }

    // Test Space activation
    let canActivateWithSpace = false
    if (focusableElements.length > 0) {
      const firstFocusable = focusableElements[0]
      const result =
        await KeyboardSimulator.testKeyboardActivation(firstFocusable)
      canActivateWithSpace = result.respondsToSpace
    }

    focusTracker.stopTracking()

    return {
      canFocusWithTab,
      canActivateWithEnter,
      canActivateWithSpace,
      focusableElements
    }
  }

  /**
   * Test color contrast for component
   */
  static testColorContrast(wrapper: VueWrapper<any>): {
    results: ContrastResult[]
    passes: boolean
    issues: string[]
  } {
    const element = wrapper.element as HTMLElement
    const results: ContrastResult[] = []
    const issues: string[] = []

    // Get computed styles
    const styles = window.getComputedStyle(element)
    const color = this.rgbToHex(styles.color)
    const backgroundColor = this.rgbToHex(styles.backgroundColor)

    if (color && backgroundColor) {
      const result = ColorContrastCalculator.checkContrastCompliance(
        color,
        backgroundColor
      )
      results.push(result)

      if (!result.passesAA) {
        issues.push(
          `Contrast ratio ${result.ratio.toFixed(2)}:1 fails WCAG AA (requires 4.5:1)`
        )
      }
    }

    const passes = results.every(result => result.passesAA)

    return { results, passes, issues }
  }

  /**
   * Test semantic HTML structure
   */
  static testSemanticStructure(wrapper: VueWrapper<any>): {
    hasProperHeadingHierarchy: boolean
    hasSemanticElements: boolean
    hasLandmarks: boolean
    issues: string[]
  } {
    const element = wrapper.element as HTMLElement
    const issues: string[] = []

    // Check heading hierarchy
    const headings = Array.from(
      element.querySelectorAll('h1, h2, h3, h4, h5, h6')
    )
    const hasProperHeadingHierarchy = this.validateHeadingHierarchy(
      headings as HTMLElement[]
    )

    if (!hasProperHeadingHierarchy) {
      issues.push('Improper heading hierarchy detected')
    }

    // Check for semantic elements
    const semanticElements = element.querySelectorAll(
      'main, nav, aside, article, section, header, footer'
    )
    const hasSemanticElements = semanticElements.length > 0

    // Check for landmarks
    const landmarks = element.querySelectorAll(
      '[role="main"], [role="navigation"], [role="complementary"], [role="banner"], [role="contentinfo"]'
    )
    const hasLandmarks = landmarks.length > 0 || hasSemanticElements

    return {
      hasProperHeadingHierarchy,
      hasSemanticElements,
      hasLandmarks,
      issues
    }
  }

  /**
   * Convert RGB color to hex
   */
  private static rgbToHex(rgb: string): string | null {
    if (!rgb || rgb === 'rgba(0, 0, 0, 0)' || rgb === 'transparent') return null

    const rgbMatch = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (!rgbMatch) return null

    const r = parseInt(rgbMatch[1])
    const g = parseInt(rgbMatch[2])
    const b = parseInt(rgbMatch[3])

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  /**
   * Validate heading hierarchy
   */
  private static validateHeadingHierarchy(headings: HTMLElement[]): boolean {
    if (headings.length === 0) return true

    let previousLevel = 0
    for (const heading of headings) {
      const currentLevel = parseInt(heading.tagName.charAt(1))

      if (previousLevel > 0 && currentLevel > previousLevel + 1) {
        return false // Skip in hierarchy detected
      }

      previousLevel = currentLevel
    }

    return true
  }
}
