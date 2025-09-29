<template>
  <div
    class="ship-system-status bg-gray-900 rounded-lg border border-blue-400 p-4 h-full flex flex-col"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-blue-400 font-mono text-sm font-bold tracking-wide">
        SYSTEM STATUS
      </h3>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
        <span class="text-green-400 font-mono text-xs">NOMINAL</span>
      </div>
    </div>

    <!-- Ship Identification -->
    <div class="mb-3">
      <div class="text-white font-mono text-xs mb-1">VESSEL: DISCOVERY ONE</div>
      <div class="text-blue-400 font-mono text-xs">MISSION: JUPITER</div>
    </div>

    <!-- System Grid -->
    <div class="flex-1 grid grid-cols-2 gap-2 text-xs font-mono">
      <!-- Navigation Systems -->
      <div class="bg-gray-800 rounded p-2">
        <div class="text-blue-300 mb-1">NAVIGATION</div>
        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-gray-300">Guidance</span>
            <span class="text-green-400">OK</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Inertial</span>
            <span class="text-green-400">OK</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Attitude</span>
            <span class="text-green-400">OK</span>
          </div>
        </div>
      </div>

      <!-- Propulsion Systems -->
      <div class="bg-gray-800 rounded p-2">
        <div class="text-blue-300 mb-1">PROPULSION</div>
        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-gray-300">Main Engine</span>
            <span class="text-green-400">OK</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">RCS</span>
            <span class="text-green-400">OK</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Fuel Level</span>
            <span class="text-yellow-400">78%</span>
          </div>
        </div>
      </div>

      <!-- Life Support Systems -->
      <div class="bg-gray-800 rounded p-2">
        <div class="text-blue-300 mb-1">LIFE SUPPORT</div>
        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-gray-300">Atmosphere</span>
            <span class="text-green-400">OK</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Recycling</span>
            <span class="text-green-400">OK</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Temperature</span>
            <span class="text-green-400">22°C</span>
          </div>
        </div>
      </div>

      <!-- Communications -->
      <div class="bg-gray-800 rounded p-2">
        <div class="text-blue-300 mb-1">COMMS</div>
        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-gray-300">Earth Link</span>
            <span class="text-green-400">OK</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">AE-35</span>
            <span class="text-yellow-400">CHECK</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Signal</span>
            <span class="text-green-400">95%</span>
          </div>
        </div>
      </div>

      <!-- Power Systems -->
      <div class="bg-gray-800 rounded p-2">
        <div class="text-blue-300 mb-1">POWER</div>
        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-gray-300">Nuclear</span>
            <span class="text-green-400">OK</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Battery</span>
            <span class="text-green-400">100%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Load</span>
            <span class="text-blue-400">67%</span>
          </div>
        </div>
      </div>

      <!-- Computer Systems -->
      <div class="bg-gray-800 rounded p-2">
        <div class="text-blue-300 mb-1">COMPUTER</div>
        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-gray-300">HAL 9000</span>
            <span class="text-green-400">OK</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Backup</span>
            <span class="text-green-400">OK</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Memory</span>
            <span class="text-blue-400">42%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Footer -->
    <div class="mt-3 pt-2 border-t border-gray-700">
      <div class="flex justify-between text-xs font-mono">
        <span class="text-gray-400">LAST UPDATE: {{ currentTime }}</span>
        <span class="text-green-400">ALL SYSTEMS NOMINAL</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'

  /**
   * Ship System Status Monitor Component
   * Displays comprehensive system status for Discovery One spacecraft
   * Shows status of navigation, propulsion, life support, communications, power, and computer systems
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
  .ship-system-status {
    font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    box-shadow:
      0 0 20px rgba(96, 165, 250, 0.2),
      inset 0 0 20px rgba(0, 0, 0, 0.5);
  }

  /* Subtle scanning line effect */
  .ship-system-status::before {
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
