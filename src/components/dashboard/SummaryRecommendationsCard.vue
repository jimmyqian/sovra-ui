<template>
  <div
    class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-lg border-2 border-indigo-300 overflow-hidden"
  >
    <div class="bg-indigo-600 p-6 text-white">
      <div class="flex items-center gap-3 mb-2">
        <component :is="ClipboardDocumentCheckIcon" class="w-10 h-10" />
        <h3 class="text-2xl font-bold">{{ title }}</h3>
      </div>
      <p class="text-indigo-100">{{ subtitle }}</p>
    </div>

    <div class="p-6 space-y-6">
      <!-- Executive Summary -->
      <div
        class="bg-white rounded-2xl p-6 shadow-lg-modern border border-slate-100"
      >
        <div class="flex items-center gap-2 mb-3">
          <component :is="DocumentTextIcon" class="w-6 h-6 text-indigo-600" />
          <h4 class="text-lg font-bold text-slate-900">Executive Summary</h4>
        </div>
        <p class="text-sm text-gray-700 leading-relaxed">
          {{ summary }}
        </p>
      </div>

      <!-- Key Findings -->
      <div
        class="bg-white rounded-2xl p-6 shadow-lg-modern border border-slate-100"
      >
        <div class="flex items-center gap-2 mb-4">
          <component
            :is="MagnifyingGlassIcon"
            class="w-6 h-6 text-indigo-600"
          />
          <h4 class="text-lg font-bold text-slate-900">Key Findings</h4>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="(finding, index) in keyFindings"
            :key="index"
            class="flex items-start gap-2 p-3 rounded-lg"
            :class="finding.colorClass"
          >
            <component
              :is="finding.icon"
              class="w-5 h-5 flex-shrink-0 mt-0.5"
            />
            <div class="text-sm">
              <span class="font-bold">{{ finding.category }}:</span>
              {{ finding.text }}
            </div>
          </div>
        </div>
      </div>

      <!-- Priority Recommendations - Hidden -->
      <div
        v-if="false"
        class="bg-white rounded-2xl p-6 shadow-lg-modern border border-slate-100"
      >
        <div class="flex items-center gap-2 mb-4">
          <component :is="LightBulbIcon" class="w-6 h-6 text-yellow-500" />
          <h4 class="text-lg font-bold text-slate-900">
            Priority Recommendations
          </h4>
        </div>
        <div class="space-y-3">
          <div
            v-for="(rec, index) in recommendations"
            :key="index"
            class="flex items-start gap-3 p-4 rounded-lg border-l-4 transition-all hover:shadow-xl-modern"
            :class="rec.borderClass + ' ' + rec.bgClass"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              :class="rec.iconBgClass"
            >
              <component :is="rec.icon" class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="px-2 py-0.5 rounded-full text-xs font-bold"
                  :class="rec.priorityClass"
                >
                  {{ rec.priority }}
                </span>
                <h5 class="font-bold text-slate-900">{{ rec.title }}</h5>
              </div>
              <p class="text-sm text-gray-700 mb-2">{{ rec.description }}</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(action, i) in rec.actions"
                  :key="i"
                  class="px-2 py-1 bg-white border border-slate-100 rounded text-xs text-gray-700"
                >
                  {{ action }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg-modern">
        <div class="flex items-center gap-2 mb-4">
          <component :is="RocketLaunchIcon" class="w-6 h-6" />
          <h4 class="text-lg font-bold">Next Steps</h4>
        </div>
        <p class="text-sm text-indigo-100">
          Please reach out to the SOVRA concierge for assistance mitigating
          these identified risks.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    ClipboardDocumentCheckIcon,
    DocumentTextIcon,
    MagnifyingGlassIcon,
    LightBulbIcon,
    RocketLaunchIcon
  } from '@heroicons/vue/24/solid'

  interface KeyFinding {
    category: string
    text: string
    icon: typeof Object
    colorClass: string
  }

  interface Recommendation {
    priority: string
    title: string
    description: string
    actions: string[]
    icon: typeof Object
    priorityClass: string
    borderClass: string
    bgClass: string
    iconBgClass: string
  }

  interface Props {
    title: string
    subtitle?: string
    summary: string
    keyFindings: KeyFinding[]
    recommendations: Recommendation[]
    nextSteps: string[]
  }

  defineProps<Props>()
</script>
