<template>
  <div
    class="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
    :class="[sizeClass]"
  >
    <!-- Header with Image/Icon -->
    <div
      v-if="headerImage || headerIcon"
      class="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative"
    >
      <img
        v-if="headerImage"
        :src="headerImage"
        :alt="title"
        class="w-full h-full object-cover"
      />
      <component
        :is="headerIcon"
        v-else-if="headerIcon"
        class="w-16 h-16 text-white opacity-80"
      />
    </div>

    <!-- Content -->
    <div class="p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-gray-600 mb-4">{{ subtitle }}</p>

      <!-- Stats Grid -->
      <div v-if="stats && stats.length > 0" class="grid grid-cols-2 gap-4 mb-4">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="text-center p-3 bg-gray-50 rounded-lg"
        >
          <div class="text-2xl font-bold text-gray-900">{{ stat.value }}</div>
          <div class="text-xs text-gray-600 mt-1">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Progress Bars -->
      <div v-if="progress && progress.length > 0" class="space-y-3">
        <div v-for="(item, index) in progress" :key="index">
          <div class="flex items-center justify-between text-sm mb-1">
            <span class="text-gray-700">{{ item.label }}</span>
            <span class="font-medium text-gray-900">{{ item.value }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="h-2 rounded-full transition-all duration-500"
              :class="getProgressColor(item.value)"
              :style="{ width: `${item.value}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="tags && tags.length > 0" class="flex flex-wrap gap-2 mt-4">
        <span
          v-for="(tag, index) in tags"
          :key="index"
          class="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'

  interface Stat {
    label: string
    value: string | number
  }

  interface ProgressItem {
    label: string
    value: number
  }

  interface Props {
    title: string
    subtitle?: string
    headerImage?: string
    headerIcon?: Component
    stats?: Stat[]
    progress?: ProgressItem[]
    tags?: string[]
    size?: 'sm' | 'md' | 'lg' | 'full'
  }

  const props = withDefaults(defineProps<Props>(), {
    subtitle: undefined,
    headerImage: undefined,
    headerIcon: undefined,
    stats: undefined,
    progress: undefined,
    tags: undefined,
    size: 'md'
  })

  const sizeClass = computed(() => {
    switch (props.size) {
      case 'sm':
        return 'col-span-1'
      case 'lg':
        return 'col-span-2'
      case 'full':
        return 'col-span-full'
      default:
        return 'col-span-1'
    }
  })

  function getProgressColor(value: number) {
    if (value >= 80) return 'bg-green-500'
    if (value >= 50) return 'bg-orange-500'
    return 'bg-red-500'
  }
</script>
