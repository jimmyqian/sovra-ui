<template>
  <div class="w-full h-full bg-bg-primary">
    <div class="h-full px-8 py-4 md:px-4">
      <!-- 2-column grid of cards with life support monitor and system status cards -->
      <div class="grid grid-cols-2 gap-4 auto-rows-max">
        <!-- Mission Overview (full width at top - ACTIVE mission status) -->
        <div class="col-span-2 h-64">
          <MissionOverviewCard />
        </div>

        <!-- Life Support Monitor (top left of second row - all crew member graphs) -->
        <div class="h-[32rem]">
          <LifeSupportMonitor @open-timeline-view="openTimelineView" />
        </div>

        <!-- Right Panel: Either Status Cards or Timeline Star View -->
        <div v-if="!isTimelineViewActive" class="contents">
          <!-- Computer System Status (top right of second row - ALERT with flashing red border) -->
          <div class="h-56">
            <ComputerStatusCard @open-mission-summary="openMissionSummary" />
          </div>

          <!-- Crew Status (directly under Computer card - CRITICAL crew casualties) -->
          <div class="h-52">
            <LifeSupportStatusCard />
          </div>

          <!-- Priority System Status Cards (arranged by alert level) -->
          <!-- WARNING Level Cards -->
          <div class="h-64">
            <CommunicationsStatusCard />
          </div>

          <div class="h-64">
            <PropulsionStatusCard />
          </div>

          <!-- NOMINAL Status Cards -->
          <div class="h-64">
            <NavigationStatusCard />
          </div>

          <div class="h-64">
            <PowerStatusCard />
          </div>
        </div>

        <!-- Timeline Star View (replaces right panel when active) -->
        <div v-else class="relative">
          <div
            class="absolute inset-0 bg-bg-primary rounded-lg border border-gray-600 flex flex-col"
          >
            <!-- Timeline header with close button -->
            <div
              class="flex items-center justify-between p-4 border-b border-gray-600"
            >
              <h3 class="text-white font-mono text-sm font-bold">
                TIMELINE - STAR VIEW
              </h3>
              <button
                class="text-gray-400 hover:text-white transition-colors duration-200 font-mono"
                aria-label="Close timeline view"
                @click="closeTimelineView"
              >
                ×
              </button>
            </div>
            <!-- Star Graph Panel -->
            <div class="flex-1">
              <StarPanel :node-count="7" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mission Summary Lightbox -->
    <MissionSummaryLightbox
      :is-open="isMissionSummaryOpen"
      @close="closeMissionSummary"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import LifeSupportMonitor from './LifeSupportMonitor.vue'
  import MissionOverviewCard from './MissionOverviewCard.vue'
  import NavigationStatusCard from './NavigationStatusCard.vue'
  import PropulsionStatusCard from './PropulsionStatusCard.vue'
  import LifeSupportStatusCard from './LifeSupportStatusCard.vue'
  import CommunicationsStatusCard from './CommunicationsStatusCard.vue'
  import PowerStatusCard from './PowerStatusCard.vue'
  import ComputerStatusCard from './ComputerStatusCard.vue'
  import MissionSummaryLightbox from './MissionSummaryLightbox.vue'
  import StarPanel from '../star/StarPanel.vue'

  // Mission summary lightbox state
  const isMissionSummaryOpen = ref(false)

  // View switching state
  const isTimelineViewActive = ref(false)

  const openMissionSummary = () => {
    isMissionSummaryOpen.value = true
  }

  const closeMissionSummary = () => {
    isMissionSummaryOpen.value = false
  }

  const openTimelineView = () => {
    isTimelineViewActive.value = true
  }

  const closeTimelineView = () => {
    isTimelineViewActive.value = false
  }

  /**
   * Spacecraft System Status Dashboard Component
   * Displays Discovery One's life support monitor and all system status cards
   * Replaces random cards with actual spacecraft system monitoring
   * Includes mission summary lightbox triggered by computer card click
   * Supports view switching to timeline star view triggered by life support monitor click
   */
</script>

<style scoped>
  /* Subtle hover effects for system status cards */
  .grid > div:hover {
    transform: translateY(-1px);
    transition: transform 0.2s ease;
  }

  /* Ensure proper spacing in grid */
  .auto-rows-max {
    grid-auto-rows: max-content;
  }
</style>
