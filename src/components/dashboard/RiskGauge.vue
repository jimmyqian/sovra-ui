<template>
  <div
    class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
  >
    <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ title }}</h3>
    <div class="flex items-center justify-center mb-4">
      <div class="relative w-48 h-48">
        <!-- Gauge Background -->
        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <!-- Background arc -->
          <path
            :d="arcPath"
            fill="none"
            stroke="#e5e7eb"
            :stroke-width="strokeWidth"
          />
          <!-- Risk level arc -->
          <path
            :d="arcPath"
            fill="none"
            :stroke="gaugeColor"
            :stroke-width="strokeWidth"
            :stroke-dasharray="`${percentage} ${100 - percentage}`"
            class="transition-all duration-500"
          />
        </svg>
        <!-- Center Text -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div class="text-3xl font-bold" :class="textColorClass">
            {{ riskLevel }}
          </div>
          <div class="text-sm text-gray-500">{{ subtitle }}</div>
        </div>
      </div>
    </div>
    <!-- Legend -->
    <div v-if="items && items.length > 0" class="space-y-2">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center justify-between text-sm"
      >
        <div class="flex items-center gap-2">
          <span
            class="w-3 h-3 rounded-full"
            :class="getRiskDotClass(item.risk)"
          ></span>
          <span class="text-gray-700">{{ item.label }}</span>
        </div>
        <span class="font-medium" :class="getRiskTextClass(item.risk)">{{
          item.risk
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface RiskItem {
    label: string
    risk: 'High' | 'Medium' | 'Low'
  }

  interface Props {
    title: string
    riskLevel: 'High' | 'Medium' | 'Low'
    subtitle?: string
    percentage?: number
    items?: RiskItem[]
  }

  const props = withDefaults(defineProps<Props>(), {
    subtitle: 'Overall Risk',
    percentage: 0,
    items: undefined
  })

  const strokeWidth = 10

  const arcPath = computed(() => {
    const radius = 50 - strokeWidth / 2
    const startAngle = 0
    const endAngle = 270 // 3/4 circle
    const start = polarToCartesian(50, 50, radius, endAngle)
    const end = polarToCartesian(50, 50, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
  })

  const gaugeColor = computed(() => {
    switch (props.riskLevel) {
      case 'High':
        return '#ef4444'
      case 'Medium':
        return '#f97316'
      case 'Low':
        return '#22c55e'
      default:
        return '#6b7280'
    }
  })

  const textColorClass = computed(() => {
    switch (props.riskLevel) {
      case 'High':
        return 'text-red-600'
      case 'Medium':
        return 'text-orange-600'
      case 'Low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  })

  function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    }
  }

  function getRiskDotClass(risk: string) {
    switch (risk) {
      case 'High':
        return 'bg-red-500'
      case 'Medium':
        return 'bg-orange-500'
      case 'Low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  function getRiskTextClass(risk: string) {
    switch (risk) {
      case 'High':
        return 'text-red-600'
      case 'Medium':
        return 'text-orange-600'
      case 'Low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }
</script>
