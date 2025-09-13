/**
 * Custom Jest/Vitest matchers for accessibility testing
 */

import { expect } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { AccessibilityTestHelper } from './accessibility-test-helpers'

/**
 * Custom matcher interface extensions
 */
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeAccessible(): Assertion<T>
    toHaveAccessibleName(expectedName?: string): Assertion<T>
    toHaveProperKeyboardNavigation(): Assertion<T>
    toMeetContrastRequirements(level?: 'AA' | 'AAA'): Assertion<T>
    toHaveValidAriaAttributes(): Assertion<T>
    toHaveSemanticStructure(): Assertion<T>
  }
}

/**
 * Check if component is accessible (comprehensive test)
 */
expect.extend({
  toBeAccessible<T = any>(wrapper: VueWrapper<T>) {
    const element = wrapper.element as HTMLElement
    const issues: string[] = []

    // Test ARIA attributes
    const ariaResult = AccessibilityTestHelper.validateAriaAttributes(element)
    issues.push(...ariaResult.errors)

    // Test semantic structure
    const semanticResult =
      AccessibilityTestHelper.testSemanticStructure(wrapper)
    issues.push(...semanticResult.issues)

    // Test color contrast
    const contrastResult = AccessibilityTestHelper.testColorContrast(wrapper)
    issues.push(...contrastResult.issues)

    const pass = issues.length === 0

    return {
      pass,
      message: () =>
        pass
          ? `Expected element to fail accessibility tests`
          : `Element failed accessibility tests:\n${issues.map(issue => `  • ${issue}`).join('\n')}`
    }
  }
})

/**
 * Check if element has accessible name
 */
expect.extend({
  toHaveAccessibleName(element: HTMLElement, expectedName?: string) {
    const actualName = AccessibilityTestHelper.getAccessibleName(element)
    const hasName = Boolean(actualName)

    let pass = hasName
    let message = ''

    if (expectedName) {
      pass = actualName === expectedName
      message = pass
        ? `Expected element not to have accessible name "${expectedName}"`
        : `Expected accessible name "${expectedName}" but got "${actualName}"`
    } else {
      message = pass
        ? `Expected element not to have an accessible name`
        : `Expected element to have an accessible name but none was found`
    }

    return { pass, message: () => message }
  }
})

/**
 * Check if component supports proper keyboard navigation
 */
expect.extend({
  async toHaveProperKeyboardNavigation<T = any>(wrapper: VueWrapper<T>) {
    const result = await AccessibilityTestHelper.testKeyboardNavigation(wrapper)

    const pass =
      result.canFocusWithTab &&
      (result.canActivateWithEnter || result.canActivateWithSpace)

    const issues: string[] = []
    if (!result.canFocusWithTab) {
      issues.push('Cannot focus with Tab key')
    }
    if (!result.canActivateWithEnter && !result.canActivateWithSpace) {
      issues.push('Cannot activate with Enter or Space keys')
    }
    if (result.focusableElements.length === 0) {
      issues.push('No focusable elements found')
    }

    return {
      pass,
      message: () =>
        pass
          ? `Expected component to fail keyboard navigation tests`
          : `Component failed keyboard navigation tests:\n${issues.map(issue => `  • ${issue}`).join('\n')}`
    }
  }
})

/**
 * Check if component meets color contrast requirements
 */
expect.extend({
  toMeetContrastRequirements<T = any>(
    wrapper: VueWrapper<T>,
    level: 'AA' | 'AAA' = 'AA'
  ) {
    const result = AccessibilityTestHelper.testColorContrast(wrapper)

    const requiredRatio = level === 'AAA' ? 7.0 : 4.5
    const pass = result.results.every(r =>
      level === 'AAA' ? r.passesAAA : r.passesAA
    )

    const failingResults = result.results.filter(r =>
      level === 'AAA' ? !r.passesAAA : !r.passesAA
    )

    return {
      pass,
      message: () =>
        pass
          ? `Expected component to fail WCAG ${level} contrast requirements`
          : `Component fails WCAG ${level} contrast requirements (${requiredRatio}:1):\n${failingResults
              .map(r => `  • Ratio ${r.ratio.toFixed(2)}:1`)
              .join('\n')}`
    }
  }
})

/**
 * Check if element has valid ARIA attributes
 */
expect.extend({
  toHaveValidAriaAttributes(element: HTMLElement, expectedRole?: string) {
    const result = AccessibilityTestHelper.validateAriaAttributes(
      element,
      expectedRole
    )
    const pass = result.errors.length === 0

    return {
      pass,
      message: () =>
        pass
          ? `Expected element to have invalid ARIA attributes`
          : `Element has invalid ARIA attributes:\n${result.errors.map(error => `  • ${error}`).join('\n')}`
    }
  }
})

/**
 * Check if component has proper semantic structure
 */
expect.extend({
  toHaveSemanticStructure<T = any>(wrapper: VueWrapper<T>) {
    const result = AccessibilityTestHelper.testSemanticStructure(wrapper)
    const pass =
      result.hasProperHeadingHierarchy &&
      (result.hasSemanticElements || result.hasLandmarks)

    const issues: string[] = []
    if (!result.hasProperHeadingHierarchy) {
      issues.push('Improper heading hierarchy')
    }
    if (!result.hasSemanticElements && !result.hasLandmarks) {
      issues.push('Missing semantic elements or landmarks')
    }
    issues.push(...result.issues)

    return {
      pass,
      message: () =>
        pass
          ? `Expected component to have poor semantic structure`
          : `Component has poor semantic structure:\n${issues.map(issue => `  • ${issue}`).join('\n')}`
    }
  }
})

export {}
