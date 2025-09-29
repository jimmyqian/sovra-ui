<template>
  <div
    class="computer-status-card bg-gray-900 rounded-lg border border-red-500 p-4 h-full flex flex-col"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-red-400 font-mono text-sm font-bold tracking-wide">
        COMPUTER
      </h3>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span class="text-red-400 font-mono text-xs">ALERT</span>
      </div>
    </div>

    <!-- Computer Systems -->
    <div class="flex-1 space-y-2 text-xs font-mono">
      <div class="flex justify-between">
        <span class="text-gray-300">HAL 9000</span>
        <span class="text-red-400">FAULT</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-300">Backup</span>
        <span class="text-green-400">OK</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-300">Memory</span>
        <span class="text-blue-400">42%</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-300">Processing</span>
        <span class="text-yellow-400">85%</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-300">Neural Net</span>
        <span class="text-red-400">ERROR</span>
      </div>
    </div>

    <!-- Status Footer -->
    <div class="mt-3 pt-2 border-t border-gray-700">
      <div class="text-xs font-mono text-red-400 text-center">
        MISSION PRIORITY OVERRIDE
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * Computer Status Card Component
   * Displays spacecraft computer system status including HAL 9000 and backup systems
   */
</script>

<style scoped>
  .computer-status-card {
    font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    box-shadow:
      0 0 20px rgba(239, 68, 68, 0.3),
      inset 0 0 20px rgba(0, 0, 0, 0.5);
  }

  /* Subtle scanning line effect */
  .computer-status-card::before {
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
