<template>
  <div
    class="navigation-status-card bg-gray-900 rounded-lg border border-blue-400 p-4 h-full flex flex-col"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-blue-400 font-mono text-sm font-bold tracking-wide">
        NAVIGATION
      </h3>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
        <span class="text-green-400 font-mono text-xs">NOMINAL</span>
      </div>
    </div>

    <!-- Navigation Systems -->
    <div class="flex-1 space-y-2 text-xs font-mono">
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
      <div class="flex justify-between">
        <span class="text-gray-300">Course</span>
        <span class="text-blue-400">JUPITER</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-300">ETA</span>
        <span class="text-blue-400">247 DAYS</span>
      </div>
    </div>

    <!-- Status Footer -->
    <div class="mt-3 pt-2 border-t border-gray-700">
      <div class="text-xs font-mono text-green-400 text-center">
        ALL SYSTEMS OPERATIONAL
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * Navigation Status Card Component
   * Displays spacecraft navigation system status including guidance, inertial, and attitude control
   */
</script>

<style scoped>
  .navigation-status-card {
    font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    box-shadow:
      0 0 20px rgba(96, 165, 250, 0.2),
      inset 0 0 20px rgba(0, 0, 0, 0.5);
  }

  /* Subtle scanning line effect */
  .navigation-status-card::before {
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
