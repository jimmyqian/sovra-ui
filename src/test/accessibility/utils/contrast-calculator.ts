/**
 * Color contrast calculation utilities for WCAG compliance testing
 */

export interface RGB {
  r: number
  g: number
  b: number
}

export interface ContrastResult {
  ratio: number
  passesAA: boolean
  passesAAA: boolean
  level: 'fail' | 'AA' | 'AAA'
}

/**
 * Utility class for calculating color contrast ratios according to WCAG guidelines
 */
export class ColorContrastCalculator {
  /**
   * Calculate contrast ratio between two colors
   */
  static getContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1)
    const rgb2 = this.hexToRgb(color2)

    if (!rgb1 || !rgb2) {
      throw new Error(
        'Invalid color format. Please use hex format (e.g., #ffffff)'
      )
    }

    const l1 = this.getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b)
    const l2 = this.getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b)

    // Calculate contrast ratio (always lighter color / darker color)
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  }

  /**
   * Check contrast compliance with detailed results
   */
  static checkContrastCompliance(
    foreground: string,
    background: string
  ): ContrastResult {
    const ratio = this.getContrastRatio(foreground, background)
    const passesAA = ratio >= 4.5
    const passesAAA = ratio >= 7.0

    return {
      ratio,
      passesAA,
      passesAAA,
      level: passesAAA ? 'AAA' : passesAA ? 'AA' : 'fail'
    }
  }

  /**
   * Convert hex color to RGB
   */
  static hexToRgb(hex: string): RGB | null {
    // Remove # if present
    const cleanHex = hex.replace('#', '')

    // Handle 3-character hex
    if (cleanHex.length === 3) {
      const expandedHex = cleanHex
        .split('')
        .map(char => char + char)
        .join('')
      return this.hexToRgb('#' + expandedHex)
    }

    // Handle 6-character hex
    if (cleanHex.length === 6) {
      const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex)
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : null
    }

    return null
  }

  /**
   * Calculate relative luminance according to WCAG formula
   */
  private static getRelativeLuminance(r: number, g: number, b: number): number {
    // Convert to sRGB
    const rsRGB = r / 255
    const gsRGB = g / 255
    const bsRGB = b / 255

    // Apply gamma correction
    const rLinear =
      rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4)
    const gLinear =
      gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4)
    const bLinear =
      bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4)

    // Calculate relative luminance using WCAG formula
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
  }

  /**
   * Get brand color contrast analysis for current theme
   */
  static analyzeBrandColors(): Record<string, ContrastResult> {
    const brandColors = {
      'brand-orange': '#ff6f16',
      'brand-orange-light': '#f7931e',
      'brand-blue': '#4285f4'
    }

    const backgrounds = {
      white: '#ffffff',
      'bg-card': '#ffffff',
      'bg-primary': '#fdf7f4'
    }

    const results: Record<string, ContrastResult> = {}

    Object.entries(brandColors).forEach(([colorName, colorValue]) => {
      Object.entries(backgrounds).forEach(([bgName, bgValue]) => {
        const key = `${colorName}-on-${bgName}`
        results[key] = this.checkContrastCompliance(colorValue, bgValue)
      })
    })

    return results
  }
}
