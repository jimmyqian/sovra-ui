<template>
  <div class="bg-bg-card border rounded-lg p-6">
    <!-- Social Media Accounts -->
    <div class="mb-6">
      <h3 class="font-semibold text-text-primary mb-4">Accounts</h3>
      <div class="flex gap-3">
        <button
          v-for="account in accounts"
          :key="account.type"
          class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
          :class="getAccountClasses(account.type)"
        >
          <div class="w-5 h-5 rounded border border-current opacity-75"></div>
        </button>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="border-b border-border-light mb-6">
      <div class="flex gap-6">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="py-2 px-1 text-sm font-medium border-b-2 transition-colors"
          :class="
            activeTab === tab.id
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
      <div v-if="activeTab === 'personal'">
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
            <span class="text-text-primary">{{ personalData.interests }}</span>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'professional'">
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

      <div v-if="activeTab === 'finance'">
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-text-secondary">Annual Income</span>
            <span class="text-text-primary">{{
              financeData.annualIncome
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">Investment Portfolio</span>
            <span class="text-text-primary">{{ financeData.investments }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">Property Value</span>
            <span class="text-text-primary">{{
              financeData.propertyValue
            }}</span>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'legal'">
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-text-secondary">Background Check</span>
            <span class="text-green-600">{{ legalData.backgroundCheck }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">Court Records</span>
            <span class="text-text-primary">{{ legalData.courtRecords }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">Licenses</span>
            <span class="text-text-primary">{{ legalData.licenses }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  interface Account {
    type: string
    url?: string
  }

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
    accounts: Account[]
    personalData: PersonalData
    professionalData: ProfessionalData
    financeData: FinanceData
    legalData: LegalData
  }

  defineProps<Props>()

  const activeTab = ref('personal')

  const tabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'professional', label: 'Professional' },
    { id: 'finance', label: 'Finance' },
    { id: 'legal', label: 'Legal' }
  ]

  const getAccountClasses = (type: string) => {
    const baseClasses = 'transition-colors'

    switch (type.toLowerCase()) {
      case 'instagram':
        return `${baseClasses} bg-pink-500 text-white hover:bg-pink-600`
      case 'whatsapp':
        return `${baseClasses} bg-green-500 text-white hover:bg-green-600`
      case 'facebook':
        return `${baseClasses} bg-blue-500 text-white hover:bg-blue-600`
      case 'twitter':
        return `${baseClasses} bg-blue-400 text-white hover:bg-blue-500`
      case 'linkedin':
        return `${baseClasses} bg-blue-700 text-white hover:bg-blue-800`
      default:
        return `${baseClasses} bg-gray-200 text-text-secondary hover:bg-gray-300`
    }
  }
</script>
