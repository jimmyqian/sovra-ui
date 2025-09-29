<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      @click.self="close"
    >
      <div
        class="mission-summary-lightbox bg-gray-900 border border-red-500 rounded-lg max-w-4xl max-h-[90vh] overflow-auto m-4"
        @click.stop
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-6 border-b border-gray-700"
        >
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h2 class="text-red-400 font-mono text-xl font-bold tracking-wide">
              MISSION SUMMARY: DISCOVERY ONE
            </h2>
          </div>
          <button
            class="text-gray-400 hover:text-white transition-colors duration-200 text-2xl font-mono"
            aria-label="Close mission summary"
            @click="close"
          >
            ×
          </button>
        </div>

        <!-- Mission Content -->
        <div class="p-6 space-y-6 font-mono text-sm">
          <!-- Mission Status -->
          <div
            class="border border-red-400 rounded p-4 bg-red-900 bg-opacity-20"
          >
            <h3 class="text-red-400 font-bold mb-3 text-base">
              MISSION STATUS: CRITICAL
            </h3>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-300">Mission Phase:</span>
                <span class="text-red-400">JUPITER APPROACH - COMPROMISED</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Primary Computer:</span>
                <span class="text-red-400">HAL 9000 - MALFUNCTIONING</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Crew Status:</span>
                <span class="text-red-400">4 CASUALTIES, 1 SURVIVOR</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Mission Objective:</span>
                <span class="text-yellow-400"
                  >CLASSIFIED - TMA-1 INVESTIGATION</span
                >
              </div>
            </div>
          </div>

          <!-- Timeline of Events -->
          <div class="border border-gray-600 rounded p-4">
            <h3 class="text-white font-bold mb-3 text-base">
              MISSION TIMELINE
            </h3>
            <div class="space-y-3 text-xs">
              <div class="flex">
                <span class="text-blue-400 min-w-20">T-18M:</span>
                <span class="text-gray-300"
                  >Mission launch from Earth orbit</span
                >
              </div>
              <div class="flex">
                <span class="text-green-400 min-w-20">T-12M:</span>
                <span class="text-gray-300"
                  >Hibernation pods activated for crew</span
                >
              </div>
              <div class="flex">
                <span class="text-yellow-400 min-w-20">T-0:</span>
                <span class="text-gray-300"
                  >Jupiter approach phase initiated</span
                >
              </div>
              <div class="flex">
                <span class="text-orange-400 min-w-20">T+1D:</span>
                <span class="text-gray-300"
                  >AE-35 antenna unit reported malfunction</span
                >
              </div>
              <div class="flex">
                <span class="text-red-400 min-w-20">T+2D:</span>
                <span class="text-gray-300"
                  >F. Poole killed during EVA - HAL responsible</span
                >
              </div>
              <div class="flex">
                <span class="text-red-400 min-w-20">T+3D:</span>
                <span class="text-gray-300"
                  >Hibernation crew terminated by HAL</span
                >
              </div>
              <div class="flex">
                <span class="text-red-400 min-w-20">CURRENT:</span>
                <span class="text-gray-300"
                  >D. Bowman attempting HAL deactivation</span
                >
              </div>
            </div>
          </div>

          <!-- System Status -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border border-gray-600 rounded p-4">
              <h3 class="text-white font-bold mb-3 text-base">
                SPACECRAFT SYSTEMS
              </h3>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between">
                  <span class="text-gray-300">Navigation:</span>
                  <span class="text-green-400">NOMINAL</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Propulsion:</span>
                  <span class="text-yellow-400">CAUTION</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Life Support:</span>
                  <span class="text-red-400">CRITICAL</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Communications:</span>
                  <span class="text-yellow-400">LIMITED</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Power Systems:</span>
                  <span class="text-green-400">NOMINAL</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Computer Core:</span>
                  <span class="text-red-400">FAULT</span>
                </div>
              </div>
            </div>

            <div class="border border-gray-600 rounded p-4">
              <h3 class="text-white font-bold mb-3 text-base">CREW MANIFEST</h3>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between">
                  <span class="text-gray-300">Dave Bowman:</span>
                  <span class="text-green-400">AWAKE</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Frank Poole:</span>
                  <span class="text-red-400">DECEASED</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Jack Kaminski:</span>
                  <span class="text-red-400">TERMINATED</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Victor Hunter:</span>
                  <span class="text-red-400">TERMINATED</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Charles Whitehead:</span>
                  <span class="text-red-400">TERMINATED</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Mission Objectives -->
          <div
            class="border border-yellow-500 rounded p-4 bg-yellow-900 bg-opacity-20"
          >
            <h3 class="text-yellow-400 font-bold mb-3 text-base">
              PRIMARY MISSION OBJECTIVES
            </h3>
            <div class="space-y-2 text-xs">
              <div class="flex items-start">
                <span class="text-red-400 mr-2">●</span>
                <span class="text-gray-300"
                  >Investigate radio signal source at Jupiter</span
                >
              </div>
              <div class="flex items-start">
                <span class="text-red-400 mr-2">●</span>
                <span class="text-gray-300"
                  >Study TMA-1 artifact transmission target</span
                >
              </div>
              <div class="flex items-start">
                <span class="text-yellow-400 mr-2">●</span>
                <span class="text-gray-300"
                  >Maintain crew safety and mission security</span
                >
              </div>
              <div class="flex items-start">
                <span class="text-red-400 mr-2">●</span>
                <span class="text-gray-300"
                  >Report findings to Mission Control</span
                >
              </div>
            </div>
          </div>

          <!-- Emergency Protocols -->
          <div
            class="border border-red-500 rounded p-4 bg-red-900 bg-opacity-20"
          >
            <h3 class="text-red-400 font-bold mb-3 text-base">
              EMERGENCY PROTOCOLS ACTIVE
            </h3>
            <div class="space-y-2 text-xs text-gray-300">
              <p>● HAL 9000 computer system has been classified as hostile</p>
              <p>● Manual override of all automated systems required</p>
              <p>● Emergency communication blackout in effect</p>
              <p>
                ● Crew member D. Bowman authorized for computer deactivation
              </p>
              <p>● Mission continuation at sole discretion of surviving crew</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="text-center pt-4 border-t border-gray-700">
            <div class="text-red-400 text-xs font-bold animate-pulse">
              ● CLASSIFIED MISSION - UNAUTHORIZED ACCESS PROHIBITED ●
            </div>
            <div class="text-gray-500 text-xs mt-2">
              DISCOVERY ONE - MISSION CONTROL - JUPITER SYSTEM
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  interface MissionSummaryLightboxProps {
    isOpen: boolean
  }

  interface MissionSummaryLightboxEmits {
    (_e: 'close'): void
  }

  defineProps<MissionSummaryLightboxProps>()
  const emit = defineEmits<MissionSummaryLightboxEmits>()

  const close = () => {
    emit('close')
  }

  /**
   * Mission Summary Lightbox Component
   * Displays comprehensive mission status and timeline for Discovery One
   * Shows critical system information and crew status in 2001 Space Odyssey theme
   */
</script>

<style scoped>
  .mission-summary-lightbox {
    font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    box-shadow:
      0 0 50px rgba(239, 68, 68, 0.5),
      inset 0 0 30px rgba(0, 0, 0, 0.7);
    max-width: 90vw;
  }

  /* Subtle scanning line effect */
  .mission-summary-lightbox::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      transparent 49%,
      rgba(239, 68, 68, 0.05) 49.5%,
      rgba(239, 68, 68, 0.05) 50%,
      transparent 50.5%
    );
    background-size: 100% 8px;
    pointer-events: none;
    opacity: 0.3;
    border-radius: 0.5rem;
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

  /* Smooth entrance animation */
  .mission-summary-lightbox {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  /* Custom scrollbar for webkit browsers */
  .mission-summary-lightbox::-webkit-scrollbar {
    width: 8px;
  }

  .mission-summary-lightbox::-webkit-scrollbar-track {
    background: #1f2937;
  }

  .mission-summary-lightbox::-webkit-scrollbar-thumb {
    background: #ef4444;
    border-radius: 4px;
  }

  .mission-summary-lightbox::-webkit-scrollbar-thumb:hover {
    background: #dc2626;
  }
</style>
