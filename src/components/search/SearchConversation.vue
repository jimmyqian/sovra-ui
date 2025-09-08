<template>
  <div class="px-8 py-8">
    <div class="flex gap-4 mb-8 items-start">
      <div
        class="w-9 h-9 border border-black rounded-full flex items-center justify-center flex-shrink-0"
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
        <div
          class="w-10 h-10 bg-gradient-brand rounded-full flex items-center justify-center flex-shrink-0"
        >
          <div class="w-6 h-6 bg-bg-card rounded-full"></div>
        </div>
        <div class="flex-1">
          <p class="mb-4 leading-relaxed">
            <strong>Fantastic!</strong> 56 persons were found in the results.
            Please provide additional information about the person you're
            looking for.
          </p>
          <p class="mb-4 leading-relaxed">
            Alternatively, you can use the hints below for finding the person
            you're looking for.
          </p>

          <div class="my-6 pl-4">
            <p
              class="text-brand-orange mb-2 cursor-pointer hover:text-brand-orange-light"
            >
              What specific software role does Johnson hold in his California
            </p>
            <p
              class="text-brand-orange mb-2 cursor-pointer hover:text-brand-orange-light"
            >
              Which California tech hubs are most likely where Johnson works
            </p>
            <p
              class="text-brand-orange mb-2 cursor-pointer hover:text-brand-orange-light"
            >
              What skills Johnson is from his current software role
            </p>
          </div>

          <p class="mb-4 leading-relaxed">
            Or include further information, such as any documents you may have
            about him, web links, pictures, or videos; if so, submit them by
            using the upload option.
          </p>

          <button
            class="bg-bg-secondary border border-border-light px-4 py-2 rounded-xl text-sm cursor-pointer hover:bg-border-hover transition-colors"
          >
            construct a filter string using the details that you provided
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    searchQuery: string
  }

  defineProps<Props>()
</script>
