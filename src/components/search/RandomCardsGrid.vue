<template>
  <div class="w-full h-full bg-bg-primary">
    <div class="h-full px-8 py-4 md:px-4">
      <!-- 2-column grid of cards with life support monitor as first card -->
      <div class="grid grid-cols-2 gap-4 auto-rows-max">
        <!-- Life Support Monitor (top left position) -->
        <div class="h-80">
          <LifeSupportMonitor />
        </div>

        <!-- Regular random cards -->
        <div
          v-for="card in cards"
          :key="card.id"
          class="rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
          :class="card.colorClass"
          :style="{ height: card.height + 'px' }"
          @click="handleCardClick(card)"
        >
          <div class="p-4 h-full flex flex-col justify-between">
            <div class="font-medium text-white text-opacity-90">
              {{ card.title }}
            </div>
            <div class="text-sm text-white text-opacity-70">
              {{ card.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import LifeSupportMonitor from './LifeSupportMonitor.vue'

  interface Card {
    id: number
    title: string
    description: string
    height: number
    colorClass: string
  }

  interface Emits {
    (_e: 'cardClick', _card: Card): void
  }

  const emit = defineEmits<Emits>()

  /**
   * Generate random height between min and max values
   * @param min Minimum height in pixels
   * @param max Maximum height in pixels
   * @returns Random height in pixels
   */
  const getRandomHeight = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * Get a random color class from predefined set
   * @returns CSS class for random background color
   */
  const getRandomColorClass = (): string => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
      'bg-emerald-500',
      'bg-rose-500',
      'bg-violet-500',
      'bg-sky-500',
      'bg-lime-500',
      'bg-amber-500',
      'bg-slate-500',
      'bg-gray-500',
      'bg-zinc-500',
      'bg-stone-500'
    ]
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex] ?? 'bg-gray-500'
  }

  /**
   * Generate sample titles for cards
   * @returns Random card title
   */
  const getRandomTitle = (): string => {
    const titles = [
      'Data Analysis',
      'User Research',
      'Product Design',
      'Market Trends',
      'Social Media',
      'Technology',
      'Innovation',
      'Strategy',
      'Growth',
      'Analytics',
      'Insights',
      'Performance',
      'Optimization',
      'Discovery',
      'Solutions',
      'Development',
      'Leadership',
      'Collaboration',
      'Success',
      'Achievement'
    ]
    const randomIndex = Math.floor(Math.random() * titles.length)
    return titles[randomIndex] ?? 'Data Analysis'
  }

  /**
   * Generate sample descriptions for cards
   * @returns Random card description
   */
  const getRandomDescription = (): string => {
    const descriptions = [
      'Explore detailed insights',
      'Discover new opportunities',
      'Track performance metrics',
      'Analyze user behavior',
      'Monitor market changes',
      'Review key findings',
      'Identify growth patterns',
      'Examine data trends',
      'Study user preferences',
      'Evaluate success rates',
      'Measure engagement levels',
      'Assess market position',
      'Review strategic goals',
      'Track progress metrics',
      'Analyze competitive landscape',
      'Monitor user activity',
      'Study market dynamics',
      'Evaluate performance data',
      'Review engagement metrics',
      'Analyze success patterns'
    ]
    const randomIndex = Math.floor(Math.random() * descriptions.length)
    return descriptions[randomIndex] ?? 'Explore detailed insights'
  }

  /**
   * Generate array of random cards with varied heights and colors
   * Reduced to 19 cards since the first position is now the life support monitor
   */
  const cards = computed((): Card[] => {
    return Array.from({ length: 19 }, (_, index) => ({
      id: index + 2, // Start from 2 since position 1 is the life support monitor
      title: getRandomTitle(),
      description: getRandomDescription(),
      height: getRandomHeight(120, 300),
      colorClass: getRandomColorClass()
    }))
  })

  /**
   * Handle card click events
   * @param card - The clicked card object
   */
  const handleCardClick = (card: Card) => {
    emit('cardClick', card)
  }
</script>

<style scoped>
  /* Additional styles for card hover effects */
  .grid > div:hover {
    transform: translateY(-2px);
  }

  /* Ensure proper spacing in grid */
  .auto-rows-max {
    grid-auto-rows: max-content;
  }
</style>
