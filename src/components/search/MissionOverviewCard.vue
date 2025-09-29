<template>
  <div
    class="mission-overview-card bg-gray-900 rounded-lg border border-blue-400 p-4 h-full flex flex-col"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-blue-400 font-mono text-sm font-bold tracking-wide">
        MISSION OVERVIEW
      </h3>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span class="text-blue-400 font-mono text-xs">ACTIVE</span>
      </div>
    </div>

    <!-- Mission Info -->
    <div class="mb-3">
      <div class="text-white font-mono text-xs mb-1">VESSEL: DISCOVERY ONE</div>
      <div class="text-blue-400 font-mono text-xs">MISSION: JUPITER</div>
    </div>

    <!-- Mission Details -->
    <div class="flex-1 space-y-2 text-xs font-mono">
      <div class="flex justify-between">
        <span class="text-gray-300">Status</span>
        <span class="text-blue-400">EN ROUTE</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-300">Distance</span>
        <span class="text-blue-400">4.2 AU</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-300">Velocity</span>
        <span class="text-green-400">11.8 KM/S</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-300">Crew</span>
        <span class="text-yellow-400">3 AWAKE</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-300">Hibernation</span>
        <span class="text-blue-400">3 PODS</span>
      </div>
    </div>

    <!-- Status Footer -->
    <div class="mt-3 pt-2 border-t border-gray-700">
      <div class="flex justify-between text-xs font-mono">
        <span class="text-gray-400">LAST UPDATE: {{ currentTime }}</span>
        <span class="text-blue-400">MISSION ONGOING</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'

  /**
   * Mission Overview Card Component
   * Displays overall mission status and spacecraft information for Discovery One
   */

  const currentTime = ref('')

  let timeInterval: number

  const updateTime = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  onMounted(() => {
    updateTime()
    timeInterval = setInterval(updateTime, 1000)
  })

  onUnmounted(() => {
    if (timeInterval) {
      clearInterval(timeInterval)
    }
  })
</script>

<style scoped>
  .mission-overview-card {
    font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    box-shadow:
      0 0 20px rgba(96, 165, 250, 0.2),
      inset 0 0 20px rgba(0, 0, 0, 0.5);
  }

  /* Subtle scanning line effect */
  .mission-overview-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      transparent 49%,
      rgba(96, 165, 250, 0.05) 49.5%,
      rgba(96, 165, 250, 0.05) 50%,
      transparent 50.5%
    );
    background-size: 100% 6px;
    pointer-events: none;
    opacity: 0.4;
  }
</style>
