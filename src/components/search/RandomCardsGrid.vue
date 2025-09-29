<template>
  <div class="w-full h-full bg-bg-primary">
    <div class="h-full px-8 py-4 md:px-4">
      <!-- 2-column grid of cards with life support monitor and system status cards -->
      <div class="grid grid-cols-2 gap-4 auto-rows-max">
        <!-- Life Support Monitor (top left position) -->
        <div class="h-80">
          <LifeSupportMonitor />
        </div>

        <!-- Mission Overview (top right position) -->
        <div class="h-80">
          <MissionOverviewCard />
        </div>

        <!-- System Status Cards -->
        <div class="h-64">
          <NavigationStatusCard />
        </div>

        <div class="h-64">
          <PropulsionStatusCard />
        </div>

        <div class="h-64">
          <LifeSupportStatusCard />
        </div>

        <div class="h-64">
          <CommunicationsStatusCard />
        </div>

        <div class="h-64">
          <PowerStatusCard />
        </div>

        <div class="h-64">
          <ComputerStatusCard />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LifeSupportMonitor from './LifeSupportMonitor.vue'
  import MissionOverviewCard from './MissionOverviewCard.vue'
  import NavigationStatusCard from './NavigationStatusCard.vue'
  import PropulsionStatusCard from './PropulsionStatusCard.vue'
  import LifeSupportStatusCard from './LifeSupportStatusCard.vue'
  import CommunicationsStatusCard from './CommunicationsStatusCard.vue'
  import PowerStatusCard from './PowerStatusCard.vue'
  import ComputerStatusCard from './ComputerStatusCard.vue'

  /**
   * Spacecraft System Status Dashboard Component
   * Displays Discovery One's life support monitor and all system status cards
   * Replaces random cards with actual spacecraft system monitoring
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
