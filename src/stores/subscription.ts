/**
 * Subscription store for managing user subscription levels
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SubscriptionLevel, SubscriptionTier } from '@/types/subscription'
import {
  SUBSCRIPTION_TIERS,
  isContentVisible,
  getRedactedText
} from '@/types/subscription'
import { useNotificationStore } from './notifications'

export const useSubscriptionStore = defineStore('subscription', () => {
  // State
  const currentLevel = ref<SubscriptionLevel>(1) // Default to Basic level

  // Getters
  const currentTier = computed<SubscriptionTier>(
    () => SUBSCRIPTION_TIERS[currentLevel.value]
  )

  const tierName = computed(() => currentTier.value.name)
  const tierColor = computed(() => currentTier.value.color)
  const tierDescription = computed(() => currentTier.value.description)
  const tierFeatures = computed(() => currentTier.value.features)

  // Actions
  function setLevel(level: SubscriptionLevel) {
    const previousLevel = currentLevel.value
    currentLevel.value = level

    // Show notification for level change
    if (previousLevel !== level) {
      const notificationStore = useNotificationStore()

      notificationStore.success(
        `Great success! I am now level ${level}!`,
        undefined, // No message, just the title
        2500 // Show for 2.5 seconds
      )
    }
  }

  function upgradeLevel() {
    if (currentLevel.value < 3) {
      setLevel((currentLevel.value + 1) as SubscriptionLevel)
    }
  }

  function downgradeLevel() {
    if (currentLevel.value > 1) {
      setLevel((currentLevel.value - 1) as SubscriptionLevel)
    }
  }

  // Utility functions
  function canViewContent(requiredLevel: SubscriptionLevel): boolean {
    return isContentVisible(requiredLevel, currentLevel.value)
  }

  function getRedactedValue(
    originalValue: string,
    requiredLevel: SubscriptionLevel,
    contentType:
      | 'phone'
      | 'email'
      | 'address'
      | 'financial'
      | 'legal'
      | 'generic' = 'generic'
  ): string {
    if (canViewContent(requiredLevel)) {
      return originalValue
    }
    return getRedactedText(contentType)
  }

  // Helper for displaying subscription-gated content
  function getContentOrRedacted(
    content: string,
    requiredLevel: SubscriptionLevel,
    contentType:
      | 'phone'
      | 'email'
      | 'address'
      | 'financial'
      | 'legal'
      | 'generic' = 'generic'
  ): { content: string; isRedacted: boolean } {
    const isRedacted = !canViewContent(requiredLevel)
    return {
      content: isRedacted ? getRedactedText(contentType) : content,
      isRedacted
    }
  }

  return {
    // State
    currentLevel,

    // Getters
    currentTier,
    tierName,
    tierColor,
    tierDescription,
    tierFeatures,

    // Actions
    setLevel,
    upgradeLevel,
    downgradeLevel,

    // Utilities
    canViewContent,
    getRedactedValue,
    getContentOrRedacted
  }
})
