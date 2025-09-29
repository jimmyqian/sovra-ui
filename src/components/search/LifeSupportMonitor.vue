<template>
  <div
    class="life-support-monitor bg-gray-900 rounded-lg border-2 border-red-500 p-4 h-full flex flex-col cursor-pointer hover:bg-gray-800 transition-colors duration-200"
    role="button"
    tabindex="0"
    aria-label="Open timeline view with star graph"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
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

    <!-- Mission Info -->
    <div class="mb-3">
      <div class="text-white font-mono text-xs mb-1">DISCOVERY ONE CREW</div>
      <div class="text-red-400 font-mono text-xs">LIFE SUPPORT MONITORING</div>
    </div>

    <!-- Crew Member Graphs -->
    <div class="flex-1 space-y-2">
      <div v-for="member in crewMembers" :key="member.name" class="relative">
        <!-- Crew member header -->
        <div class="flex items-center justify-between mb-1">
          <span class="text-gray-300 font-mono text-xs">{{ member.name }}</span>
          <span class="font-mono text-xs" :class="member.statusColor">
            {{ member.status }}
          </span>
        </div>

        <!-- Mini graph -->
        <div class="h-8 relative bg-gray-800 rounded border border-gray-600">
          <!-- Grid lines -->
          <div class="absolute inset-0 flex justify-between opacity-20">
            <div
              v-for="i in 4"
              :key="i"
              class="border-l border-gray-500 h-full"
            ></div>
          </div>

          <!-- Life support line -->
          <svg
            class="absolute inset-0 w-full h-full"
            viewBox="0 0 100 32"
            preserveAspectRatio="none"
          >
            <polyline
              :points="member.lifeSupport"
              fill="none"
              :stroke="member.lineColor"
              stroke-width="1.5"
              vector-effect="non-scaling-stroke"
            />
            <!-- Death/termination marker -->
            <circle
              v-if="member.endMarker"
              :cx="member.endMarker.x"
              :cy="member.endMarker.y"
              r="1.5"
              :fill="member.endMarker.color"
              vector-effect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Mission timeline -->
    <div class="mt-2 flex justify-between text-xs font-mono text-gray-400">
      <span>T-0</span>
      <span>EVA</span>
      <span>HAL MALFUNCTION</span>
      <span>CURRENT</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface LifeSupportMonitorEmits {
    (_e: 'openTimelineView'): void
  }

  const emit = defineEmits<LifeSupportMonitorEmits>()

  const handleClick = () => {
    emit('openTimelineView')
  }

  /**
   * Life Support Monitor Component
   * Displays life support graphs for all Discovery One crew members
   * Shows the timeline of HAL 9000's hostile actions against the crew
   * Clickable to open timeline view with star graph
   */

  interface CrewMember {
    name: string
    status: string
    statusColor: string
    lineColor: string
    lifeSupport: string
    endMarker?: {
      x: number
      y: number
      color: string
    }
  }

  // Generate life support data for each crew member
  const generateLifeSupportData = (
    pattern: 'stable' | 'eva_death' | 'hibernation_terminated'
  ) => {
    const points = []

    if (pattern === 'stable') {
      // Dave Bowman - still alive and stable
      for (let x = 0; x <= 100; x += 5) {
        const y = 3 + Math.random() * 2 // 94-97% range (inverted for SVG)
        points.push(`${x},${y}`)
      }
    } else if (pattern === 'eva_death') {
      // Frank Poole - dies during EVA
      // Healthy phase
      for (let x = 0; x <= 40; x += 5) {
        const y = 3 + Math.random() * 2
        points.push(`${x},${y}`)
      }
      // Critical decline during EVA
      for (let x = 40; x <= 65; x += 2) {
        const progress = (x - 40) / 25
        const y = 3 + progress * 27 + Math.random() * 1
        points.push(`${x},${y}`)
      }
    } else {
      // Hibernation crew - terminated by HAL
      // Stable hibernation phase
      for (let x = 0; x <= 60; x += 5) {
        const y = 8 + Math.random() * 1 // Lower but stable hibernation vitals
        points.push(`${x},${y}`)
      }
      // Sudden termination
      for (let x = 60; x <= 75; x += 1) {
        const progress = (x - 60) / 15
        const y = 8 + progress * 22
        points.push(`${x},${y}`)
      }
    }

    return points.map(point => point).join(' ')
  }

  const crewMembers = computed<CrewMember[]>(() => [
    {
      name: 'D. BOWMAN',
      status: 'AWAKE',
      statusColor: 'text-green-400',
      lineColor: '#22c55e',
      lifeSupport: generateLifeSupportData('stable')
    },
    {
      name: 'F. POOLE',
      status: 'DECEASED',
      statusColor: 'text-red-400',
      lineColor: '#ef4444',
      lifeSupport: generateLifeSupportData('eva_death'),
      endMarker: {
        x: 65,
        y: 30,
        color: '#dc2626'
      }
    },
    {
      name: 'J. KAMINSKI',
      status: 'TERMINATED',
      statusColor: 'text-red-400',
      lineColor: '#f59e0b',
      lifeSupport: generateLifeSupportData('hibernation_terminated'),
      endMarker: {
        x: 75,
        y: 30,
        color: '#dc2626'
      }
    },
    {
      name: 'V. HUNTER',
      status: 'TERMINATED',
      statusColor: 'text-red-400',
      lineColor: '#f59e0b',
      lifeSupport: generateLifeSupportData('hibernation_terminated'),
      endMarker: {
        x: 75,
        y: 30,
        color: '#dc2626'
      }
    },
    {
      name: 'C. WHITEHEAD',
      status: 'TERMINATED',
      statusColor: 'text-red-400',
      lineColor: '#f59e0b',
      lifeSupport: generateLifeSupportData('hibernation_terminated'),
      endMarker: {
        x: 75,
        y: 30,
        color: '#dc2626'
      }
    }
  ])
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
