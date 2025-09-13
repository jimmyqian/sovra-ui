/**
 * Formats a number with proper thousand separators
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

/**
 * Formats a rating to one decimal place
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1)
}

/**
 * Formats file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Formats a name to proper case
 */
export const formatName = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Truncates text to a specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 3)}...`
}

/**
 * Formats a percentage value
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`
}

/**
 * Formats time duration in human-readable format
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m`
  }
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
}

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (text: string): string => {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Formats a string to kebab-case
 */
export const toKebabCase = (text: string): string => {
  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Formats a string to camelCase
 */
export const toCamelCase = (text: string): string => {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/[\s-_]+/g, '')
}

/**
 * Pluralizes a word based on count
 */
export const pluralize = (
  word: string,
  count: number,
  suffix = 's'
): string => {
  return count === 1 ? word : word + suffix
}

/**
 * Formats age display
 */
export const formatAge = (age: number): string => {
  return `${age} ${pluralize('Year', age)}`
}

/**
 * Extracts initials from a full name
 */
export const getInitials = (name: string, maxInitials = 2): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxInitials)
    .join('')
}

/**
 * Formats phone number (basic US format)
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  return phone // Return original if not 10 digits
}

/**
 * Formats email for display (truncates domain if too long)
 */
export const formatEmailForDisplay = (
  email: string,
  maxLength = 30
): string => {
  if (email.length <= maxLength) return email

  const [username, domain] = email.split('@')
  if (!domain) return email // Return as-is if no @ symbol

  const truncatedDomain =
    domain.length > 15 ? `${domain.slice(0, 12)}...` : domain

  return `${username}@${truncatedDomain}`
}

/**
 * Formats currency value
 */
export const formatCurrency = (
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount)
}

/**
 * Formats date relative to now (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${pluralize('minute', minutes)} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${pluralize('hour', hours)} ago`
  }
  const days = Math.floor(diffInSeconds / 86400)
  return `${days} ${pluralize('day', days)} ago`
}
