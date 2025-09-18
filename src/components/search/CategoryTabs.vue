<template>
  <div class="bg-bg-card border rounded-lg p-6">
    <!-- Show upgrade message if no accessible tabs are available -->
    <div
      v-if="!allTabs.some(tab => isTabAccessible(tab.id))"
      class="text-center py-8"
    >
      <div class="text-text-secondary text-sm mb-2">
        Detailed information requires a higher subscription level
      </div>
      <div class="text-xs text-text-secondary">
        Press Ctrl+2 or Ctrl+3 to upgrade your access level
      </div>
    </div>

    <!-- Category Tabs -->
    <div v-else>
      <div class="border-b border-border-light mb-6">
        <div class="flex gap-6">
          <button
            v-for="tab in availableTabs"
            :key="tab.id"
            class="py-2 px-1 text-sm font-medium border-b-2 transition-colors"
            :class="[
              validActiveTab === tab.id
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent',
              isTabAccessible(tab.id)
                ? 'text-text-secondary hover:text-text-primary cursor-pointer'
                : 'text-text-muted cursor-not-allowed opacity-60'
            ]"
            :disabled="!isTabAccessible(tab.id)"
            @click="isTabAccessible(tab.id) ? (activeTab = tab.id) : null"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="space-y-4">
        <div v-if="validActiveTab === 'personal'">
          <div
            class="space-y-3 text-sm"
            :class="
              isTabAccessible('personal')
                ? ''
                : 'bg-bg-muted rounded-lg p-4 opacity-60'
            "
          >
            <div class="flex justify-between">
              <span class="text-text-secondary">Relationship Status</span>
              <span class="text-text-primary">{{
                isTabAccessible('personal')
                  ? personalData.relationshipStatus
                  : '████████'
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Children</span>
              <span class="text-text-primary">{{
                isTabAccessible('personal') ? personalData.children : '████████'
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Interests</span>
              <span class="text-text-primary">{{
                isTabAccessible('personal')
                  ? personalData.interests
                  : '████████'
              }}</span>
            </div>
          </div>
        </div>

        <div v-if="validActiveTab === 'professional'">
          <div
            class="space-y-3 text-sm"
            :class="
              isTabAccessible('professional')
                ? ''
                : 'bg-bg-muted rounded-lg p-4 opacity-60'
            "
          >
            <div class="flex justify-between">
              <span class="text-text-secondary">Industry</span>
              <span class="text-text-primary">{{
                isTabAccessible('professional')
                  ? professionalData.industry
                  : '████████'
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Years Experience</span>
              <span class="text-text-primary">{{
                isTabAccessible('professional')
                  ? professionalData.experience
                  : '████████'
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Previous Companies</span>
              <span class="text-text-primary">{{
                isTabAccessible('professional')
                  ? professionalData.previousCompanies
                  : '████████'
              }}</span>
            </div>
          </div>
        </div>

        <div v-if="validActiveTab === 'finance'">
          <div
            class="space-y-3 text-sm"
            :class="
              isTabAccessible('finance')
                ? ''
                : 'bg-bg-muted rounded-lg p-4 opacity-60'
            "
          >
            <div class="flex justify-between">
              <span class="text-text-secondary">Annual Income</span>
              <span class="text-text-primary">{{
                isTabAccessible('finance')
                  ? financeData.annualIncome
                  : '████████'
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Investment Portfolio</span>
              <span class="text-text-primary">{{
                isTabAccessible('finance')
                  ? financeData.investments
                  : '████████'
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Property Value</span>
              <span class="text-text-primary">{{
                isTabAccessible('finance')
                  ? financeData.propertyValue
                  : '████████'
              }}</span>
            </div>
          </div>
        </div>

        <div v-if="validActiveTab === 'legal'">
          <div
            class="space-y-3 text-sm"
            :class="
              isTabAccessible('legal')
                ? ''
                : 'bg-bg-muted rounded-lg p-4 opacity-60'
            "
          >
            <div class="flex justify-between">
              <span class="text-text-secondary">Background Check</span>
              <span class="text-green-600">{{
                isTabAccessible('legal')
                  ? legalData.backgroundCheck
                  : '████████'
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Court Records</span>
              <span class="text-text-primary">{{
                isTabAccessible('legal') ? legalData.courtRecords : '████████'
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Licenses</span>
              <span class="text-text-primary">{{
                isTabAccessible('legal') ? legalData.licenses : '████████'
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useSubscriptionStore } from '@/stores/subscription'
  import type { SubscriptionLevel } from '@/types/subscription'

  interface PersonalData {
    relationshipStatus: string
    children: string
    interests: string
  }

  interface ProfessionalData {
    industry: string
    experience: string
    previousCompanies: string
  }

  interface FinanceData {
    annualIncome: string
    investments: string
    propertyValue: string
  }

  interface LegalData {
    backgroundCheck: string
    courtRecords: string
    licenses: string
  }

  interface Props {
    personalData: PersonalData
    professionalData: ProfessionalData
    financeData: FinanceData
    legalData: LegalData
  }

  defineProps<Props>()

  const subscriptionStore = useSubscriptionStore()
  const activeTab = ref('personal')

  // Define subscription level requirements for each category
  // Personal: Level 1+ (all levels)
  // Professional: Level 2+
  // Finance: Level 3+
  // Legal: Level 3+ (keeping existing)
  const categoryRequirements: Record<string, SubscriptionLevel> = {
    personal: 1, // Level 1+ (all levels)
    professional: 2, // Level 2+ (Standard and Premium)
    finance: 3, // Level 3+ (Premium)
    legal: 3 // Level 3+ (Premium)
  }

  // Show all tabs, but mark which ones are accessible
  const allTabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'professional', label: 'Professional' },
    { id: 'finance', label: 'Finance' },
    { id: 'legal', label: 'Legal' }
  ]

  const availableTabs = computed(() => allTabs)

  // Check if a tab is accessible based on subscription level
  const isTabAccessible = (tabId: string): boolean => {
    const requiredLevel = categoryRequirements[tabId]
    return requiredLevel
      ? subscriptionStore.canViewContent(requiredLevel)
      : false
  }

  // Check if current active tab is accessible, if not switch to first accessible
  const validActiveTab = computed(() => {
    if (isTabAccessible(activeTab.value)) {
      return activeTab.value
    }
    // Find first accessible tab
    const firstAccessible = allTabs.find(tab => isTabAccessible(tab.id))
    return firstAccessible?.id || 'personal'
  })
</script>
