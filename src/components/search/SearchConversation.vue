<template>
  <div class="px-8 py-8">
    <div class="flex gap-4 mb-8 items-start">
      <div
        class="w-9 h-9 border border-black rounded-full flex items-center justify-center flex-shrink-0 ml-0.5"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle
            cx="12"
            cy="7"
            r="4"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <div class="flex-1">
        <div class="rounded-lg font-medium">
          {{ searchQuery }}
        </div>
      </div>
    </div>

    <div class="flex flex-col">
      <div class="flex gap-4">
        <div class="w-10 h-10 flex items-center justify-center flex-shrink-0">
          <LogoIcon :size="36" color="var(--color-logo-gray)" />
        </div>
        <div class="flex-1">
          <p class="mb-4 leading-relaxed text-text-secondary">
            <strong>Fantastic!</strong> 56 persons were found in the results.
            Please provide additional information about the person you're
            looking for.
          </p>
          <p class="mb-4 leading-relaxed text-text-secondary">
            Alternatively, you can use the hints below for finding the person
            you're looking for.
          </p>

          <div class="my-6">
            <p
              class="text-brand-orange pb-2 cursor-pointer hover:text-brand-orange-light border-t border-dashed border-border-dashed pt-2"
            >
              What specific software role does Johnson hold in his California
              job
            </p>
            <p
              class="text-brand-orange pb-2 cursor-pointer hover:text-brand-orange-light border-t border-dashed border-border-dashed pt-2"
            >
              Which California tech hubs are most likely where Johnson works
            </p>
            <p
              class="text-brand-orange pb-2 cursor-pointer hover:text-brand-orange-light border-t border-dashed border-border-dashed pt-2 border-b"
            >
              What skills Johnson has from his current software role
            </p>
          </div>

          <p class="mb-4 leading-relaxed text-text-secondary">
            Or include further information, such as any documents you may have
            about him, web links, pictures, or videos; if so, submit them by
            using the upload option.
          </p>

          <button
            class="bg-bg-button border border-dashed border-border-dashed px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-border-hover transition-colors text-brand-orange"
          >
            create a filter using the details that you provided
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LogoIcon from '@/components/icons/LogoIcon.vue'

  interface Props {
    searchQuery: string
  }

  const _props = defineProps<Props>()
</script>
