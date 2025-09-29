<template>
  <div
    class="mission-overview-card bg-gray-900 rounded-lg border border-red-500 p-4 h-full flex flex-col animate-flash-border"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-red-400 font-mono text-sm font-bold tracking-wide">
        MISSION OVERVIEW
      </h3>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span class="text-red-400 font-mono text-xs">ALERT</span>
      </div>
    </div>

    <!-- Mission Info -->
    <div class="mb-3">
      <div class="text-white font-mono text-xs mb-1">VESSEL: DISCOVERY ONE</div>
      <div class="text-red-400 font-mono text-xs">
        MISSION: JUPITER - CRITICAL
      </div>
    </div>

    <!-- Mission Details -->
    <div class="flex-1 space-y-2 text-xs font-mono">
      <div class="flex justify-between">
        <span class="text-gray-300">Status</span>
        <span class="text-red-400">COMPROMISED</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-300">Distance</span>
        <span class="text-blue-400">4.2 AU</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-300">Velocity</span>
        <span class="text-yellow-400">11.8 KM/S</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-300">Crew</span>
        <span class="text-red-400">1 AWAKE</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-300">Hibernation</span>
        <span class="text-red-400">3 TERMINATED</span>
      </div>
    </div>

    <!-- Status Footer -->
    <div class="mt-3 pt-2 border-t border-gray-700">
      <div class="flex justify-between text-xs font-mono">
        <span class="text-gray-400">LAST UPDATE: {{ currentTime }}</span>
        <span class="text-red-400">MISSION CRITICAL</span>
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
      0 0 20px rgba(239, 68, 68, 0.3),
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
      rgba(239, 68, 68, 0.1) 49.5%,
      rgba(239, 68, 68, 0.1) 50%,
      transparent 50.5%
    );
    background-size: 100% 4px;
    pointer-events: none;
    opacity: 0.6;
  }

  .animate-flash-border {
    animation: flash-border 1.5s ease-in-out infinite;
  }

  @keyframes flash-border {
    0%,
    100% {
      border-color: #ef4444;
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
    }
    50% {
      border-color: #dc2626;
      box-shadow: 0 0 30px rgba(239, 68, 68, 0.6);
    }
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
</style>
