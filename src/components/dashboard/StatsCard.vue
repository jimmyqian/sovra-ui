<template>
  <div
    class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
    :class="[sizeClass]"
  >
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <div class="text-sm text-gray-500 mb-1">{{ label }}</div>
        <div class="text-3xl font-bold text-gray-900">{{ value }}</div>
        <div v-if="subtitle" class="text-xs text-gray-600 mt-1">
          {{ subtitle }}
        </div>
      </div>
      <div
        v-if="icon"
        class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
        :class="iconBackgroundClass"
      >
        <component :is="icon" class="w-6 h-6" :class="iconColorClass" />
      </div>
    </div>
    <div v-if="trend" class="flex items-center gap-2 text-sm">
      <span
        class="font-medium"
        :class="trend.direction === 'up' ? 'text-green-600' : 'text-red-600'"
      >
        {{ trend.direction === 'up' ? '↑' : '↓' }} {{ trend.value }}
      </span>
      <span class="text-gray-500">{{ trend.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'

  interface Trend {
    direction: 'up' | 'down'
    value: string
    label: string
  }

  interface Props {
    label: string
    value: string | number
    subtitle?: string
    icon?: Component
    iconColor?: 'blue' | 'green' | 'red' | 'orange' | 'purple'
    trend?: Trend
    size?: 'sm' | 'md' | 'lg'
  }

  const props = withDefaults(defineProps<Props>(), {
    subtitle: undefined,
    icon: undefined,
    iconColor: 'blue',
    trend: undefined,
    size: 'md'
  })

  const sizeClass = computed(() => {
    switch (props.size) {
      case 'sm':
        return 'col-span-1'
      case 'lg':
        return 'col-span-2'
      default:
        return 'col-span-1'
    }
  })

  const iconBackgroundClass = computed(() => {
    switch (props.iconColor) {
      case 'blue':
        return 'bg-blue-50'
      case 'green':
        return 'bg-green-50'
      case 'red':
        return 'bg-red-50'
      case 'orange':
        return 'bg-orange-50'
      case 'purple':
        return 'bg-purple-50'
      default:
        return 'bg-gray-50'
    }
  })

  const iconColorClass = computed(() => {
    switch (props.iconColor) {
      case 'blue':
        return 'text-blue-600'
      case 'green':
        return 'text-green-600'
      case 'red':
        return 'text-red-600'
      case 'orange':
        return 'text-orange-600'
      case 'purple':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  })
</script>
