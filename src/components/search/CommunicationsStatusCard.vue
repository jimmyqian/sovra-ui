<template>
  <div
    class="communications-status-card bg-gray-900 rounded-lg border border-yellow-500 p-4 h-full flex flex-col"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-yellow-400 font-mono text-sm font-bold tracking-wide">
        COMMUNICATIONS
      </h3>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
        <span class="text-yellow-400 font-mono text-xs">WARNING</span>
      </div>
    </div>

    <!-- Communications Systems -->
    <div class="flex-1 space-y-2 text-xs font-mono">
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
      <div class="flex justify-between">
        <span class="text-gray-300">Delay</span>
        <span class="text-blue-400">14 MIN</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-300">Bandwidth</span>
        <span class="text-green-400">1.2 KB/S</span>
      </div>
    </div>

    <!-- Status Footer -->
    <div class="mt-3 pt-2 border-t border-gray-700">
      <div class="text-xs font-mono text-yellow-400 text-center">
        AE-35 UNIT MALFUNCTION
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * Communications Status Card Component
   * Displays spacecraft communications system status including Earth link and antenna systems
   */
</script>

<style scoped>
  .communications-status-card {
    font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    box-shadow:
      0 0 20px rgba(234, 179, 8, 0.2),
      inset 0 0 20px rgba(0, 0, 0, 0.5);
  }

  /* Subtle scanning line effect */
  .communications-status-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      transparent 49%,
      rgba(234, 179, 8, 0.05) 49.5%,
      rgba(234, 179, 8, 0.05) 50%,
      transparent 50.5%
    );
    background-size: 100% 6px;
    pointer-events: none;
    opacity: 0.4;
  }
</style>
