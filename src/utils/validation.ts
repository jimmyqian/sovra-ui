/**
 * Validates if a string is a valid email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Validates if a string is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validates if a phone number has a valid format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10 || cleaned.length === 11
}

/**
 * Validates if a string is not empty or just whitespace
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0
}

/**
 * Validates if a number is within a specified range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

/**
 * Validates if a string meets minimum length requirement
 */
export const meetsMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength
}

/**
 * Validates if a string doesn't exceed maximum length
 */
export const withinMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength
}

/**
 * Validates if a value is a positive number
 */
export const isPositiveNumber = (value: number): boolean => {
  return typeof value === 'number' && !isNaN(value) && value > 0
}

/**
 * Validates if a file type is allowed
 */
export const isAllowedFileType = (
  filename: string,
  allowedTypes: string[]
): boolean => {
  const extension = filename.toLowerCase().split('.').pop()
  return extension ? allowedTypes.includes(extension) : false
}

/**
 * Validates if a file size is within limits
 */
export const isValidFileSize = (
  sizeInBytes: number,
  maxSizeMB: number
): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return sizeInBytes <= maxSizeBytes
}

/**
 * Validates if a rating is within valid range (1-5)
 */
export const isValidRating = (rating: number): boolean => {
  return isInRange(rating, 1, 5)
}

/**
 * Validates if age is realistic for the application
 */
export const isValidAge = (age: number): boolean => {
  return isInRange(age, 18, 120)
}

/**
 * Validates if a string contains only letters and spaces
 */
export const isOnlyLettersAndSpaces = (value: string): boolean => {
  return /^[a-zA-Z\s]+$/.test(value)
}

/**
 * Validates if a string is alphanumeric
 */
export const isAlphanumeric = (value: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(value)
}

/**
 * Validates if a password meets strength requirements
 */
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, one number
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  )
}

/**
 * Validates multiple conditions and returns validation results
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export const validateSearchQuery = (query: string): ValidationResult => {
  const errors: string[] = []

  if (!isNotEmpty(query)) {
    errors.push('Search query cannot be empty')
  }

  if (!withinMaxLength(query, 500)) {
    errors.push('Search query cannot exceed 500 characters')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates user profile data
 */
export const validateUserProfile = (profile: {
  name: string
  email: string
  age: number
  phone?: string
}): ValidationResult => {
  const errors: string[] = []

  if (!isNotEmpty(profile.name)) {
    errors.push('Name is required')
  } else if (!isOnlyLettersAndSpaces(profile.name)) {
    errors.push('Name can only contain letters and spaces')
  }

  if (!isValidEmail(profile.email)) {
    errors.push('Please enter a valid email address')
  }

  if (!isValidAge(profile.age)) {
    errors.push('Age must be between 18 and 120')
  }

  if (profile.phone && !isValidPhoneNumber(profile.phone)) {
    errors.push('Please enter a valid phone number')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates file upload
 */
export const validateFileUpload = (
  file: File,
  allowedTypes: string[] = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif'],
  maxSizeMB = 10
): ValidationResult => {
  const errors: string[] = []

  if (!isAllowedFileType(file.name, allowedTypes)) {
    errors.push(
      `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    )
  }

  if (!isValidFileSize(file.size, maxSizeMB)) {
    errors.push(`File size cannot exceed ${maxSizeMB}MB`)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates search filter values
 */
export const validateSearchFilter = (filter: {
  type: string
  value: string
}): ValidationResult => {
  const errors: string[] = []

  if (!isNotEmpty(filter.type)) {
    errors.push('Filter type is required')
  }

  if (!isNotEmpty(filter.value)) {
    errors.push('Filter value is required')
  }

  if (filter.type === 'age' && filter.value) {
    const age = parseInt(filter.value)
    if (isNaN(age) || !isValidAge(age)) {
      errors.push('Age must be a valid number between 18 and 120')
    }
  }

  if (filter.type === 'rating' && filter.value) {
    const rating = parseFloat(filter.value)
    if (isNaN(rating) || !isValidRating(rating)) {
      errors.push('Rating must be between 1 and 5')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitizes input by removing potentially harmful characters
 */
export const sanitizeInput = (input: string): string => {
  return input.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ''
  )
}

/**
 * Validates if a value is a valid JSON string
 */
export const isValidJSON = (value: string): boolean => {
  try {
    JSON.parse(value)
    return true
  } catch {
    return false
  }
}
