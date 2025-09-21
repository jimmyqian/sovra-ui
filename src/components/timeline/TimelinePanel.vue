<template>
  <div class="flex-1 flex flex-col max-h-full overflow-hidden bg-bg-primary">
    <div class="flex-1 p-4">
      <D3Timeline :events="timelineEvents" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import D3Timeline from './D3Timeline.vue'
  import timelineData from '../../../timeline-data.json'

  interface TimelineEvent {
    year: number
    title: string
    category: string
  }

  const timelineEvents = ref<TimelineEvent[]>([])

  /**
   * Loads timeline events from JSON data
   */
  const loadTimelineEvents = (): void => {
    timelineEvents.value = timelineData as TimelineEvent[]
  }

  onMounted(() => {
    loadTimelineEvents()
  })
</script>

<script lang="ts">
  export default {
    name: 'TimelinePanel'
  }
</script>
