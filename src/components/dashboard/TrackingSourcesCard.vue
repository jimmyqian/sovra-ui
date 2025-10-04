<template>
  <div
    class="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
  >
    <div class="p-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
    </div>
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="source in sources"
          :key="source.name"
          class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
        >
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            :class="source.colorClass"
          >
            <component :is="source.icon" class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 text-sm mb-1">
              {{ source.name }}
            </h4>
            <p class="text-xs text-gray-600 mb-2">{{ source.description }}</p>
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold text-gray-700"
                >{{ source.count }} results</span
              >
              <span
                class="px-2 py-0.5 rounded-full text-xs font-medium"
                :class="source.statusClass"
                >{{ source.status }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface TrackingSource {
    name: string
    description: string
    count: number
    status: string
    icon: typeof Object
    colorClass: string
    statusClass: string
  }

  interface Props {
    title: string
    subtitle?: string
    sources: TrackingSource[]
  }

  defineProps<Props>()
</script>
