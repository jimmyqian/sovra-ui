import { describe, it, expect } from 'vitest'
import {
  formatNumber,
  formatRating,
  formatFileSize,
  formatName,
  truncateText,
  formatPercentage,
  formatDuration,
  capitalize,
  toKebabCase,
  toCamelCase,
  pluralize,
  formatAge,
  getInitials,
  formatPhoneNumber,
  formatEmailForDisplay,
  formatCurrency,
  formatRelativeTime
} from '@/utils/format'

describe('Format Utilities', () => {
  describe('formatNumber', () => {
    it('formats numbers with thousand separators', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
      expect(formatNumber(123456789)).toBe('123,456,789')
    })

    it('handles small numbers', () => {
      expect(formatNumber(0)).toBe('0')
      expect(formatNumber(123)).toBe('123')
    })

    it('handles negative numbers', () => {
      expect(formatNumber(-1000)).toBe('-1,000')
    })
  })

  describe('formatRating', () => {
    it('formats rating to one decimal place', () => {
      expect(formatRating(4.5)).toBe('4.5')
      expect(formatRating(3)).toBe('3.0')
      expect(formatRating(4.789)).toBe('4.8')
    })
  })

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B')
      expect(formatFileSize(512)).toBe('512 B')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(1048576)).toBe('1 MB')
      expect(formatFileSize(1073741824)).toBe('1 GB')
    })

    it('handles decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(2621440)).toBe('2.5 MB')
    })
  })

  describe('formatName', () => {
    it('formats names to proper case', () => {
      expect(formatName('john doe')).toBe('John Doe')
      expect(formatName('JANE SMITH')).toBe('Jane Smith')
      expect(formatName('alice JOHNSON')).toBe('Alice Johnson')
    })

    it('handles single names', () => {
      expect(formatName('john')).toBe('John')
    })

    it('handles multiple spaces', () => {
      expect(formatName('john  doe')).toBe('John  Doe')
    })
  })

  describe('truncateText', () => {
    it('truncates text longer than max length', () => {
      expect(truncateText('This is a long text', 10)).toBe('This is...')
    })

    it('returns original text if shorter than max length', () => {
      expect(truncateText('Short', 10)).toBe('Short')
    })

    it('handles edge cases', () => {
      expect(truncateText('Exactly 10', 10)).toBe('Exactly 10')
      expect(truncateText('One char longer', 10)).toBe('One cha...')
    })
  })

  describe('formatPercentage', () => {
    it('formats percentage with default decimals', () => {
      expect(formatPercentage(85.5)).toBe('85.5%')
      expect(formatPercentage(100)).toBe('100.0%')
    })

    it('formats percentage with custom decimals', () => {
      expect(formatPercentage(85.555, 2)).toBe('85.56%')
      expect(formatPercentage(85.555, 0)).toBe('86%')
    })
  })

  describe('formatDuration', () => {
    it('formats seconds', () => {
      expect(formatDuration(30)).toBe('30s')
      expect(formatDuration(59)).toBe('59s')
    })

    it('formats minutes', () => {
      expect(formatDuration(60)).toBe('1m')
      expect(formatDuration(90)).toBe('1m')
      expect(formatDuration(120)).toBe('2m')
    })

    it('formats hours', () => {
      expect(formatDuration(3600)).toBe('1h')
      expect(formatDuration(3660)).toBe('1h 1m')
      expect(formatDuration(7200)).toBe('2h')
    })
  })

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('world')).toBe('World')
    })

    it('handles empty strings', () => {
      expect(capitalize('')).toBe('')
    })

    it('handles single characters', () => {
      expect(capitalize('a')).toBe('A')
    })
  })

  describe('toKebabCase', () => {
    it('converts camelCase to kebab-case', () => {
      expect(toKebabCase('camelCase')).toBe('camel-case')
      expect(toKebabCase('longCamelCaseString')).toBe('long-camel-case-string')
    })

    it('converts spaces to dashes', () => {
      expect(toKebabCase('hello world')).toBe('hello-world')
      expect(toKebabCase('multiple  spaces')).toBe('multiple-spaces')
    })

    it('handles underscores', () => {
      expect(toKebabCase('snake_case')).toBe('snake-case')
    })
  })

  describe('toCamelCase', () => {
    it('converts kebab-case to camelCase', () => {
      expect(toCamelCase('kebab-case')).toBe('kebabCase')
      expect(toCamelCase('long-kebab-case-string')).toBe('longKebabCaseString')
    })

    it('converts spaces to camelCase', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld')
      expect(toCamelCase('multiple  words  here')).toBe('multipleWordsHere')
    })
  })

  describe('pluralize', () => {
    it('pluralizes with default suffix', () => {
      expect(pluralize('cat', 0)).toBe('cats')
      expect(pluralize('cat', 1)).toBe('cat')
      expect(pluralize('cat', 2)).toBe('cats')
    })

    it('uses custom suffix', () => {
      expect(pluralize('child', 2, 'ren')).toBe('children')
      expect(pluralize('child', 1, 'ren')).toBe('child')
    })
  })

  describe('formatAge', () => {
    it('formats age with proper pluralization', () => {
      expect(formatAge(1)).toBe('1 Year')
      expect(formatAge(25)).toBe('25 Years')
      expect(formatAge(0)).toBe('0 Years')
    })
  })

  describe('getInitials', () => {
    it('gets initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD')
      expect(getInitials('Jane Elizabeth Smith')).toBe('JE')
    })

    it('handles single names', () => {
      expect(getInitials('John')).toBe('J')
    })

    it('respects maxInitials parameter', () => {
      expect(getInitials('John Elizabeth Smith', 3)).toBe('JES')
      expect(getInitials('John Elizabeth Smith Williams', 2)).toBe('JE')
    })
  })

  describe('formatPhoneNumber', () => {
    it('formats 10-digit phone numbers', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890')
      expect(formatPhoneNumber('555-123-4567')).toBe('(555) 123-4567')
    })

    it('returns original for invalid formats', () => {
      expect(formatPhoneNumber('123')).toBe('123')
      expect(formatPhoneNumber('12345678901')).toBe('12345678901')
    })

    it('handles numbers with non-digit characters', () => {
      expect(formatPhoneNumber('(555) 123-4567')).toBe('(555) 123-4567')
    })
  })

  describe('formatEmailForDisplay', () => {
    it('returns short emails unchanged', () => {
      expect(formatEmailForDisplay('user@example.com')).toBe('user@example.com')
    })

    it('truncates long domains', () => {
      const longEmail = 'user@verylongdomainname.com'
      const formatted = formatEmailForDisplay(longEmail, 20)
      expect(formatted).toContain('user@')
      expect(formatted).toContain('...')
    })

    it('preserves username in truncation', () => {
      const longEmail = 'username@verylongdomainname.com'
      const formatted = formatEmailForDisplay(longEmail, 25)
      expect(formatted.startsWith('username@')).toBe(true)
    })
  })

  describe('formatCurrency', () => {
    it('formats USD currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('handles different currencies', () => {
      expect(formatCurrency(1234.56, 'EUR', 'en-US')).toBe('€1,234.56')
    })

    it('handles large amounts', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
    })
  })

  describe('formatRelativeTime', () => {
    it('formats recent times', () => {
      const now = new Date()
      const fiveSecondsAgo = new Date(now.getTime() - 5000)
      expect(formatRelativeTime(fiveSecondsAgo)).toBe('just now')
    })

    it('formats minutes ago', () => {
      const now = new Date()
      const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000)
      expect(formatRelativeTime(twoMinutesAgo)).toBe('2 minutes ago')

      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000)
      expect(formatRelativeTime(oneMinuteAgo)).toBe('1 minute ago')
    })

    it('formats hours ago', () => {
      const now = new Date()
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
      expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago')

      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago')
    })

    it('formats days ago', () => {
      const now = new Date()
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      expect(formatRelativeTime(twoDaysAgo)).toBe('2 days ago')

      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      expect(formatRelativeTime(oneDayAgo)).toBe('1 day ago')
    })
  })
})
