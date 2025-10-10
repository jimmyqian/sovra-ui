<template>
  <div
    class="bg-white rounded-2xl shadow-lg-modern p-8 mb-4 border border-slate-100 hover:shadow-xl-modern transition-all cursor-pointer"
    @click="toggleExpanded"
  >
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-bold text-slate-900 mb-1">
          {{ title }}
        </h3>
        <div v-if="subtitle" class="text-sm text-slate-600">{{ subtitle }}</div>
      </div>
      <div v-if="riskLevel" class="ml-4">
        <span
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="getRiskLevelClass(riskLevel)"
        >
          {{ riskLevel }}
        </span>
      </div>
    </div>

    <!-- Risk Items - Visual Grid Display -->
    <div
      v-if="riskItems && riskItems.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4"
    >
      <div
        v-for="(item, index) in riskItems"
        :key="index"
        class="relative p-4 rounded-lg border-2 transition-all hover:shadow-xl-modern"
        :class="[
          getRiskBorderClass(item.risk),
          getRiskBackgroundClass(item.risk)
        ]"
      >
        <!-- Risk indicator bar -->
        <div
          class="absolute top-0 left-0 right-0 h-2 rounded-t-lg"
          :class="getRiskBarClass(item.risk)"
        ></div>

        <div class="flex items-start gap-3">
          <div class="flex-shrink-0">
            <!-- Risk icon circle - LARGER for high risk -->
            <div
              class="rounded-full flex items-center justify-center"
              :class="[
                getRiskIconBgClass(item.risk),
                item.risk === 'High' ? 'w-14 h-14' : 'w-10 h-10'
              ]"
            >
              <span
                class="font-bold"
                :class="[
                  getRiskIconTextClass(item.risk),
                  item.risk === 'High' ? 'text-2xl' : 'text-lg'
                ]"
              >
                {{ item.risk.charAt(0) }}
              </span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-2">
              <span
                class="font-bold"
                :class="[
                  item.risk === 'High'
                    ? 'text-red-900 text-lg'
                    : 'text-slate-900'
                ]"
                >{{ item.domain }}</span
              >
              <span
                class="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide"
                :class="getRiskBadgeClass(item.risk)"
              >
                {{ item.risk }}
              </span>
            </div>
            <p class="text-sm text-slate-600 leading-relaxed">
              {{ item.exposure }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content sections -->
    <div v-if="content" class="prose prose-sm max-w-none text-gray-700 mb-4">
      <div v-html="content"></div>
    </div>

    <!-- Expandable Details -->
    <div
      v-if="isExpanded && details"
      class="mt-4 pt-4 border-t border-slate-100"
    >
      <div class="prose prose-sm max-w-none text-slate-600">
        <div v-html="details"></div>
      </div>
    </div>

    <!-- Actions -->
    <div v-if="actions && actions.length > 0" class="mt-4 space-y-2">
      <div class="text-sm font-bold text-gray-700 mb-2">
        Recommended Actions:
      </div>
      <ul class="space-y-1">
        <li
          v-for="(action, index) in actions"
          :key="index"
          class="text-sm text-slate-600 flex items-start gap-2"
        >
          <span class="text-brand-orange mt-1">•</span>
          <span>{{ action }}</span>
        </li>
      </ul>
    </div>

    <!-- Expand/Collapse indicator -->
    <div v-if="details" class="mt-4 text-center">
      <span class="text-xs text-gray-400">
        {{ isExpanded ? 'Click to collapse' : 'Click for details' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  export interface RiskItem {
    domain: string
    risk: 'High' | 'Medium' | 'Low'
    exposure: string
  }

  interface Props {
    title: string
    subtitle?: string
    riskLevel?: 'High Risk' | 'Medium Risk' | 'Low Risk'
    riskItems?: RiskItem[]
    content?: string
    details?: string
    actions?: string[]
  }

  defineProps<Props>()

  const isExpanded = ref(false)

  const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value
  }

  const getRiskLevelClass = (level: string) => {
    switch (level) {
      case 'High Risk':
        return 'bg-red-100 text-red-800'
      case 'Medium Risk':
        return 'bg-orange-100 text-orange-800'
      case 'Low Risk':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskBadgeClass = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'bg-red-50 text-red-700'
      case 'Medium':
        return 'bg-orange-50 text-orange-700'
      case 'Low':
        return 'bg-green-50 text-green-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  const getRiskBorderClass = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'border-red-400 hover:border-red-500'
      case 'Medium':
        return 'border-orange-200 hover:border-orange-300'
      case 'Low':
        return 'border-green-200 hover:border-green-300'
      default:
        return 'border-slate-100 hover:border-gray-300'
    }
  }

  const getRiskBackgroundClass = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'bg-gradient-to-br from-red-50 to-red-100'
      case 'Medium':
        return 'bg-gradient-to-br from-orange-50 to-white'
      case 'Low':
        return 'bg-gradient-to-br from-green-50 to-white'
      default:
        return 'bg-gradient-to-br from-gray-50 to-white'
    }
  }

  const getRiskBarClass = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'bg-red-600 shadow-lg shadow-red-500/50'
      case 'Medium':
        return 'bg-orange-500'
      case 'Low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getRiskIconBgClass = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'bg-red-600 shadow-lg shadow-red-500/50'
      case 'Medium':
        return 'bg-orange-100'
      case 'Low':
        return 'bg-green-100'
      default:
        return 'bg-gray-100'
    }
  }

  const getRiskIconTextClass = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'text-white'
      case 'Medium':
        return 'text-orange-700'
      case 'Low':
        return 'text-green-700'
      default:
        return 'text-gray-700'
    }
  }
</script>

<style scoped>
  .prose :deep(p) {
    margin-bottom: 0.75rem;
  }

  .prose :deep(strong) {
    color: #1f2937;
    font-weight: 600;
  }

  .prose :deep(ul) {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .prose :deep(li) {
    margin-bottom: 0.25rem;
  }
</style>
