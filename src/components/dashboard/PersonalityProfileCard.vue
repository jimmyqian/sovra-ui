<template>
  <div
    class="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
  >
    <div class="p-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
    </div>
    <div class="p-6">
      <!-- Summary -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-700 leading-relaxed">
          {{ summary }}
        </p>
      </div>

      <!-- Traits Grid -->
      <div class="space-y-4">
        <div
          v-for="trait in traits"
          :key="trait.label"
          class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            :class="trait.colorClass"
          >
            <component :is="trait.icon" class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 text-sm mb-1">
              {{ trait.label }}
            </h4>
            <p class="text-xs text-gray-600 leading-relaxed">
              {{ trait.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BoltIcon } from '@heroicons/vue/24/solid'

  interface Trait {
    label: string
    description: string
    icon: typeof BoltIcon
    colorClass: string
  }

  interface Props {
    title: string
    subtitle?: string
    summary: string
    traits: Trait[]
  }

  defineProps<Props>()
</script>
