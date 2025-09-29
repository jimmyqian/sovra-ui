<template>
  <div
    class="power-status-card bg-gray-900 rounded-lg border border-green-500 p-4 h-full flex flex-col"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-green-400 font-mono text-sm font-bold tracking-wide">
        POWER
      </h3>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
        <span class="text-green-400 font-mono text-xs">NOMINAL</span>
      </div>
    </div>

    <!-- Power Systems -->
    <div class="flex-1 space-y-2 text-xs font-mono">
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
      <div class="flex justify-between">
        <span class="text-gray-300">Output</span>
        <span class="text-green-400">2.4 MW</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-300">Backup</span>
        <span class="text-green-400">READY</span>
      </div>
    </div>

    <!-- Status Footer -->
    <div class="mt-3 pt-2 border-t border-gray-700">
      <div class="text-xs font-mono text-green-400 text-center">
        POWER GRID STABLE
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * Power Status Card Component
   * Displays spacecraft power system status including nuclear reactor, batteries, and load distribution
   */
</script>

<style scoped>
  .power-status-card {
    font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    box-shadow:
      0 0 20px rgba(34, 197, 94, 0.2),
      inset 0 0 20px rgba(0, 0, 0, 0.5);
  }

  /* Subtle scanning line effect */
  .power-status-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      transparent 49%,
      rgba(34, 197, 94, 0.05) 49.5%,
      rgba(34, 197, 94, 0.05) 50%,
      transparent 50.5%
    );
    background-size: 100% 6px;
    pointer-events: none;
    opacity: 0.4;
  }
</style>
