/**
 * Subscription level types and definitions
 */

export type SubscriptionLevel = 1 | 2 | 3

export interface SubscriptionTier {
  level: SubscriptionLevel
  name: string
  description: string
  features: string[]
  color: string
}

export const SUBSCRIPTION_TIERS: Record<SubscriptionLevel, SubscriptionTier> = {
  1: {
    level: 1,
    name: 'Basic',
    description: 'Limited access with basic information',
    features: [
      'Basic profile information',
      'Limited contact details',
      'Public records only'
    ],
    color: '#6b7280' // gray-500
  },
  2: {
    level: 2,
    name: 'Standard',
    description: 'Enhanced access with detailed information',
    features: [
      'Full profile information',
      'Contact details',
      'Public and some private records',
      'Professional history',
      'Basic financial data'
    ],
    color: '#3b82f6' // blue-500
  },
  3: {
    level: 3,
    name: 'Premium',
    description: 'Complete access to all available information',
    features: [
      'Complete profile access',
      'All contact information',
      'Full public and private records',
      'Detailed professional history',
      'Complete financial data',
      'Legal records',
      'Advanced analytics'
    ],
    color: '#f59e0b' // amber-500
  }
}

/**
 * Check if content should be visible at the given subscription level
 */
export function isContentVisible(
  requiredLevel: SubscriptionLevel,
  userLevel: SubscriptionLevel
): boolean {
  return userLevel >= requiredLevel
}

/**
 * Get redacted placeholder text based on content type
 */
export function getRedactedText(
  contentType:
    | 'phone'
    | 'email'
    | 'address'
    | 'financial'
    | 'legal'
    | 'generic' = 'generic'
): string {
  const placeholders = {
    phone: '***-***-****',
    email: '***@***.***',
    address: '*** ******* St, ****, ** *****',
    financial: '$***,***',
    legal: '[Requires higher subscription]',
    generic: '[Redacted]'
  }

  return placeholders[contentType]
}
