import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  isValidUrl,
  isValidPhoneNumber,
  isNotEmpty,
  isInRange,
  meetsMinLength,
  withinMaxLength,
  isPositiveNumber,
  isAllowedFileType,
  isValidFileSize,
  isValidRating,
  isValidAge,
  isOnlyLettersAndSpaces,
  isAlphanumeric,
  isStrongPassword,
  validateSearchQuery,
  validateUserProfile,
  validateFileUpload,
  validateSearchFilter,
  sanitizeInput,
  isValidJSON
} from '@/utils/validation'

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('validates correct email formats', () => {
      expect(isValidEmail('user@example.com')).toBe(true)
      expect(isValidEmail('test.user+tag@domain.co.uk')).toBe(true)
      expect(isValidEmail('user123@domain.org')).toBe(true)
    })

    it('rejects invalid email formats', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
      expect(isValidEmail('user@domain')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })

    it('handles emails with whitespace', () => {
      expect(isValidEmail(' user@example.com ')).toBe(true)
      expect(isValidEmail('user @example.com')).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    it('validates correct URL formats', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://domain.org/path')).toBe(true)
      expect(isValidUrl('ftp://ftp.example.com')).toBe(true)
    })

    it('rejects invalid URL formats', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('http://')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })
  })

  describe('isValidPhoneNumber', () => {
    it('validates 10-digit phone numbers', () => {
      expect(isValidPhoneNumber('1234567890')).toBe(true)
      expect(isValidPhoneNumber('(555) 123-4567')).toBe(true)
      expect(isValidPhoneNumber('555-123-4567')).toBe(true)
    })

    it('validates 11-digit phone numbers', () => {
      expect(isValidPhoneNumber('15551234567')).toBe(true)
      expect(isValidPhoneNumber('+1 555 123 4567')).toBe(true)
    })

    it('rejects invalid phone numbers', () => {
      expect(isValidPhoneNumber('123')).toBe(false)
      expect(isValidPhoneNumber('123456789012')).toBe(false)
      expect(isValidPhoneNumber('')).toBe(false)
    })
  })

  describe('isNotEmpty', () => {
    it('returns true for non-empty strings', () => {
      expect(isNotEmpty('hello')).toBe(true)
      expect(isNotEmpty('a')).toBe(true)
    })

    it('returns false for empty or whitespace strings', () => {
      expect(isNotEmpty('')).toBe(false)
      expect(isNotEmpty('   ')).toBe(false)
      expect(isNotEmpty('\t\n')).toBe(false)
    })
  })

  describe('isInRange', () => {
    it('validates numbers within range', () => {
      expect(isInRange(5, 1, 10)).toBe(true)
      expect(isInRange(1, 1, 10)).toBe(true)
      expect(isInRange(10, 1, 10)).toBe(true)
    })

    it('rejects numbers outside range', () => {
      expect(isInRange(0, 1, 10)).toBe(false)
      expect(isInRange(11, 1, 10)).toBe(false)
    })
  })

  describe('meetsMinLength', () => {
    it('validates strings meeting minimum length', () => {
      expect(meetsMinLength('hello', 3)).toBe(true)
      expect(meetsMinLength('hello', 5)).toBe(true)
    })

    it('rejects strings below minimum length', () => {
      expect(meetsMinLength('hi', 3)).toBe(false)
    })
  })

  describe('withinMaxLength', () => {
    it('validates strings within maximum length', () => {
      expect(withinMaxLength('hello', 10)).toBe(true)
      expect(withinMaxLength('hello', 5)).toBe(true)
    })

    it('rejects strings exceeding maximum length', () => {
      expect(withinMaxLength('hello world', 5)).toBe(false)
    })
  })

  describe('isPositiveNumber', () => {
    it('validates positive numbers', () => {
      expect(isPositiveNumber(1)).toBe(true)
      expect(isPositiveNumber(0.1)).toBe(true)
      expect(isPositiveNumber(1000)).toBe(true)
    })

    it('rejects non-positive numbers', () => {
      expect(isPositiveNumber(0)).toBe(false)
      expect(isPositiveNumber(-1)).toBe(false)
      expect(isPositiveNumber(NaN)).toBe(false)
    })

    it('rejects non-numbers', () => {
      expect(isPositiveNumber('5' as unknown as number)).toBe(false)
      expect(isPositiveNumber(null as unknown as number)).toBe(false)
    })
  })

  describe('isAllowedFileType', () => {
    it('validates allowed file types', () => {
      expect(isAllowedFileType('document.pdf', ['pdf', 'doc'])).toBe(true)
      expect(isAllowedFileType('image.JPG', ['jpg', 'png'])).toBe(true)
    })

    it('rejects disallowed file types', () => {
      expect(isAllowedFileType('script.exe', ['pdf', 'doc'])).toBe(false)
      expect(isAllowedFileType('file', ['pdf', 'doc'])).toBe(false)
    })

    it('is case insensitive', () => {
      expect(isAllowedFileType('FILE.PDF', ['pdf'])).toBe(true)
    })
  })

  describe('isValidFileSize', () => {
    it('validates files within size limit', () => {
      expect(isValidFileSize(1024, 1)).toBe(true) // 1KB, max 1MB
      expect(isValidFileSize(1048576, 1)).toBe(true) // 1MB, max 1MB
    })

    it('rejects files exceeding size limit', () => {
      expect(isValidFileSize(2097152, 1)).toBe(false) // 2MB, max 1MB
    })
  })

  describe('isValidRating', () => {
    it('validates ratings in range 1-5', () => {
      expect(isValidRating(1)).toBe(true)
      expect(isValidRating(3.5)).toBe(true)
      expect(isValidRating(5)).toBe(true)
    })

    it('rejects ratings outside range', () => {
      expect(isValidRating(0)).toBe(false)
      expect(isValidRating(6)).toBe(false)
    })
  })

  describe('isValidAge', () => {
    it('validates realistic ages', () => {
      expect(isValidAge(18)).toBe(true)
      expect(isValidAge(65)).toBe(true)
      expect(isValidAge(120)).toBe(true)
    })

    it('rejects unrealistic ages', () => {
      expect(isValidAge(17)).toBe(false)
      expect(isValidAge(121)).toBe(false)
    })
  })

  describe('isOnlyLettersAndSpaces', () => {
    it('validates strings with only letters and spaces', () => {
      expect(isOnlyLettersAndSpaces('John Doe')).toBe(true)
      expect(isOnlyLettersAndSpaces('Mary Jane Watson')).toBe(true)
    })

    it('rejects strings with numbers or symbols', () => {
      expect(isOnlyLettersAndSpaces('John123')).toBe(false)
      expect(isOnlyLettersAndSpaces('John-Doe')).toBe(false)
      expect(isOnlyLettersAndSpaces('John@Doe')).toBe(false)
    })
  })

  describe('isAlphanumeric', () => {
    it('validates alphanumeric strings', () => {
      expect(isAlphanumeric('abc123')).toBe(true)
      expect(isAlphanumeric('username1')).toBe(true)
      expect(isAlphanumeric('123')).toBe(true)
    })

    it('rejects strings with spaces or symbols', () => {
      expect(isAlphanumeric('user name')).toBe(false)
      expect(isAlphanumeric('user-name')).toBe(false)
      expect(isAlphanumeric('user@domain')).toBe(false)
    })
  })

  describe('isStrongPassword', () => {
    it('validates strong passwords', () => {
      expect(isStrongPassword('Password123')).toBe(true)
      expect(isStrongPassword('MySecure1Pass')).toBe(true)
    })

    it('rejects weak passwords', () => {
      expect(isStrongPassword('password')).toBe(false) // no uppercase, no number
      expect(isStrongPassword('PASSWORD123')).toBe(false) // no lowercase
      expect(isStrongPassword('Password')).toBe(false) // no number
      expect(isStrongPassword('Pass1')).toBe(false) // too short
    })
  })

  describe('validateSearchQuery', () => {
    it('validates correct search queries', () => {
      const result = validateSearchQuery('john doe')
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('rejects empty queries', () => {
      const result = validateSearchQuery('')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Search query cannot be empty')
    })

    it('rejects queries that are too long', () => {
      const longQuery = 'a'.repeat(501)
      const result = validateSearchQuery(longQuery)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        'Search query cannot exceed 500 characters'
      )
    })
  })

  describe('validateUserProfile', () => {
    const validProfile = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      phone: '1234567890'
    }

    it('validates correct user profile', () => {
      const result = validateUserProfile(validProfile)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('validates profile without phone', () => {
      const profileWithoutPhone = { ...validProfile }
      delete (profileWithoutPhone as Record<string, unknown>).phone
      const result = validateUserProfile(profileWithoutPhone)
      expect(result.isValid).toBe(true)
    })

    it('rejects invalid name', () => {
      const result = validateUserProfile({
        ...validProfile,
        name: 'John123'
      })
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        'Name can only contain letters and spaces'
      )
    })

    it('rejects invalid email', () => {
      const result = validateUserProfile({
        ...validProfile,
        email: 'invalid-email'
      })
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Please enter a valid email address')
    })

    it('rejects invalid age', () => {
      const result = validateUserProfile({
        ...validProfile,
        age: 15
      })
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Age must be between 18 and 120')
    })

    it('rejects invalid phone', () => {
      const result = validateUserProfile({
        ...validProfile,
        phone: '123'
      })
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Please enter a valid phone number')
    })
  })

  describe('validateFileUpload', () => {
    const createMockFile = (name: string, size: number): File => {
      return {
        name,
        size,
        type: 'application/pdf'
      } as File
    }

    it('validates allowed file', () => {
      const file = createMockFile('document.pdf', 1024)
      const result = validateFileUpload(file)
      expect(result.isValid).toBe(true)
    })

    it('rejects disallowed file type', () => {
      const file = createMockFile('script.exe', 1024)
      const result = validateFileUpload(file)
      expect(result.isValid).toBe(false)
      expect(result.errors[0]).toContain('File type not allowed')
    })

    it('rejects oversized file', () => {
      const file = createMockFile('document.pdf', 11 * 1024 * 1024) // 11MB
      const result = validateFileUpload(file)
      expect(result.isValid).toBe(false)
      expect(result.errors[0]).toContain('File size cannot exceed 10MB')
    })
  })

  describe('validateSearchFilter', () => {
    it('validates correct filter', () => {
      const result = validateSearchFilter({
        type: 'location',
        value: 'California'
      })
      expect(result.isValid).toBe(true)
    })

    it('validates age filter', () => {
      const result = validateSearchFilter({
        type: 'age',
        value: '25'
      })
      expect(result.isValid).toBe(true)
    })

    it('rejects invalid age filter', () => {
      const result = validateSearchFilter({
        type: 'age',
        value: '15'
      })
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        'Age must be a valid number between 18 and 120'
      )
    })

    it('validates rating filter', () => {
      const result = validateSearchFilter({
        type: 'rating',
        value: '4.5'
      })
      expect(result.isValid).toBe(true)
    })

    it('rejects invalid rating filter', () => {
      const result = validateSearchFilter({
        type: 'rating',
        value: '6'
      })
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Rating must be between 1 and 5')
    })
  })

  describe('sanitizeInput', () => {
    it('removes script tags', () => {
      const malicious = 'Hello <script>alert("xss")</script> World'
      const sanitized = sanitizeInput(malicious)
      expect(sanitized).toBe('Hello  World')
    })

    it('handles multiple script tags', () => {
      const malicious =
        '<script>bad()</script>Good text<script>more bad()</script>'
      const sanitized = sanitizeInput(malicious)
      expect(sanitized).toBe('Good text')
    })

    it('leaves safe content unchanged', () => {
      const safe = 'This is <b>bold</b> and <i>italic</i>'
      const sanitized = sanitizeInput(safe)
      expect(sanitized).toBe(safe)
    })
  })

  describe('isValidJSON', () => {
    it('validates correct JSON strings', () => {
      expect(isValidJSON('{"name": "John"}')).toBe(true)
      expect(isValidJSON('[1, 2, 3]')).toBe(true)
      expect(isValidJSON('"string"')).toBe(true)
    })

    it('rejects invalid JSON strings', () => {
      expect(isValidJSON('{"name": John}')).toBe(false)
      expect(isValidJSON('[1, 2, 3')).toBe(false)
      expect(isValidJSON('invalid')).toBe(false)
    })
  })
})
