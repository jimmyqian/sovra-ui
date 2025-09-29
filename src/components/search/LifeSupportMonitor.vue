<template>
  <div
    class="life-support-monitor bg-gray-900 rounded-lg border-2 border-red-500 p-4 h-full flex flex-col"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-red-400 font-mono text-sm font-bold tracking-wide">
        LIFE SUPPORT
      </h3>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span class="text-red-400 font-mono text-xs">CRITICAL</span>
      </div>
    </div>

    <!-- Crew Member Info -->
    <div class="mb-3">
      <div class="text-white font-mono text-xs mb-1">CREW MEMBER: F. POOLE</div>
      <div class="text-red-400 font-mono text-xs">STATUS: DECEASED</div>
    </div>

    <!-- Life Support Graph -->
    <div class="flex-1 relative">
      <div class="absolute inset-0 flex flex-col">
        <!-- Y-axis labels -->
        <div
          class="flex-1 flex flex-col justify-between text-xs font-mono text-gray-400"
        >
          <span class="leading-none">100%</span>
          <span class="leading-none">75%</span>
          <span class="leading-none">50%</span>
          <span class="leading-none">25%</span>
          <span class="leading-none">0%</span>
        </div>
      </div>

      <!-- Graph container -->
      <div
        class="ml-8 h-full relative bg-gray-800 rounded border border-gray-600"
      >
        <!-- Grid lines -->
        <div class="absolute inset-0">
          <div class="h-full flex flex-col justify-between">
            <div
              v-for="i in 5"
              :key="i"
              class="border-t border-gray-600 border-opacity-30"
            ></div>
          </div>
          <div class="absolute inset-0 flex justify-between">
            <div
              v-for="i in 6"
              :key="i"
              class="border-l border-gray-600 border-opacity-30 h-full"
            ></div>
          </div>
        </div>

        <!-- Life support line graph -->
        <svg
          class="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <!-- Healthy phase (0-30%) -->
          <polyline
            :points="healthyPhasePoints"
            fill="none"
            stroke="#22c55e"
            stroke-width="0.8"
            vector-effect="non-scaling-stroke"
          />

          <!-- Declining phase (30-70%) -->
          <polyline
            :points="decliningPhasePoints"
            fill="none"
            stroke="#eab308"
            stroke-width="0.8"
            vector-effect="non-scaling-stroke"
          />

          <!-- Critical phase (70-100%) -->
          <polyline
            :points="criticalPhasePoints"
            fill="none"
            stroke="#ef4444"
            stroke-width="1.2"
            vector-effect="non-scaling-stroke"
          />

          <!-- Death marker -->
          <circle
            cx="95"
            cy="95"
            r="1"
            fill="#dc2626"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>

    <!-- Time indicators -->
    <div class="mt-2 flex justify-between text-xs font-mono text-gray-400 pl-8">
      <span>00:00</span>
      <span>EVA START</span>
      <span>SYSTEM FAIL</span>
      <span>00:47</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  /**
   * Life Support Monitor Component
   * Displays a declining graph showing crew member's life support failure during EVA
   * Represents HAL 9000's deliberate termination of Frank Poole
   */

  // Generate points for healthy phase (stable around 95-100%)
  const healthyPhasePoints = computed(() => {
    const points = []
    for (let x = 0; x <= 30; x += 2) {
      const y = 5 + Math.random() * 3 // 95-98% range (inverted for SVG)
      points.push(`${x},${y}`)
    }
    return points.join(' ')
  })

  // Generate points for declining phase (starts dropping)
  const decliningPhasePoints = computed(() => {
    const points = []
    for (let x = 30; x <= 70; x += 2) {
      const progress = (x - 30) / 40
      const y = 5 + progress * 40 + Math.random() * 5 // Gradual decline with noise
      points.push(`${x},${y}`)
    }
    return points.join(' ')
  })

  // Generate points for critical phase (rapid decline to death)
  const criticalPhasePoints = computed(() => {
    const points = []
    for (let x = 70; x <= 95; x += 1) {
      const progress = (x - 70) / 25
      const y = 45 + progress * 48 + Math.random() * 2 // Rapid decline to 0%
      points.push(`${x},${y}`)
    }
    return points.join(' ')
  })
</script>

<style scoped>
  .life-support-monitor {
    font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    box-shadow:
      0 0 20px rgba(239, 68, 68, 0.3),
      inset 0 0 20px rgba(0, 0, 0, 0.5);
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Scanline effect */
  .life-support-monitor::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      transparent 49%,
      rgba(239, 68, 68, 0.1) 49.5%,
      rgba(239, 68, 68, 0.1) 50%,
      transparent 50.5%
    );
    background-size: 100% 4px;
    pointer-events: none;
    opacity: 0.6;
  }
</style>
