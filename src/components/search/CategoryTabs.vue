<template>
  <div class="bg-bg-card border rounded-lg p-6">
    <!-- Show upgrade message if no tabs are available -->
    <div v-if="availableTabs.length === 0" class="text-center py-8">
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
            :class="
              validActiveTab === tab.id
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            "
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="space-y-4">
        <div v-if="validActiveTab === 'personal'">
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-text-secondary">Relationship Status</span>
              <span class="text-text-primary">{{
                personalData.relationshipStatus
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Children</span>
              <span class="text-text-primary">{{ personalData.children }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Interests</span>
              <span class="text-text-primary">{{
                personalData.interests
              }}</span>
            </div>
          </div>
        </div>

        <div v-if="validActiveTab === 'professional'">
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-text-secondary">Industry</span>
              <span class="text-text-primary">{{
                professionalData.industry
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Years Experience</span>
              <span class="text-text-primary">{{
                professionalData.experience
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Previous Companies</span>
              <span class="text-text-primary">{{
                professionalData.previousCompanies
              }}</span>
            </div>
          </div>
        </div>

        <div v-if="validActiveTab === 'finance'">
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-text-secondary">Annual Income</span>
              <span class="text-text-primary">{{
                financeData.annualIncome
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Investment Portfolio</span>
              <span class="text-text-primary">{{
                financeData.investments
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Property Value</span>
              <span class="text-text-primary">{{
                financeData.propertyValue
              }}</span>
            </div>
          </div>
        </div>

        <div v-if="validActiveTab === 'legal'">
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-text-secondary">Background Check</span>
              <span class="text-green-600">{{
                legalData.backgroundCheck
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Court Records</span>
              <span class="text-text-primary">{{
                legalData.courtRecords
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Licenses</span>
              <span class="text-text-primary">{{ legalData.licenses }}</span>
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
  // Personal: Always visible (all levels)
  // Professional: Visible for level 1+
  // Finance: Visible for level 2+
  // Legal: Visible for level 3+
  const categoryRequirements: Record<string, SubscriptionLevel> = {
    personal: 1, // Level 1+ (all levels)
    professional: 1, // Level 1+ (all levels)
    finance: 2, // Level 2+ (Standard and Premium)
    legal: 3 // Level 3 only (Premium)
  }

  // Filter tabs based on subscription level
  const availableTabs = computed(() => {
    const allTabs = [
      { id: 'personal', label: 'Personal' },
      { id: 'professional', label: 'Professional' },
      { id: 'finance', label: 'Finance' },
      { id: 'legal', label: 'Legal' }
    ]

    return allTabs.filter(tab => {
      const requiredLevel = categoryRequirements[tab.id]
      return requiredLevel
        ? subscriptionStore.canViewContent(requiredLevel)
        : false
    })
  })

  // Check if current active tab is available, if not switch to first available
  const validActiveTab = computed(() => {
    if (availableTabs.value.some(tab => tab.id === activeTab.value)) {
      return activeTab.value
    }
    return availableTabs.value[0]?.id || 'personal'
  })
</script>
