<template>
  <div class="px-8 py-8">
    <!-- User Message -->
    <div v-if="userQuery" class="flex gap-4 mb-8 items-start">
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
          {{ userQuery }}
        </div>
      </div>
    </div>

    <!-- System Messages -->
    <div v-for="message in messages" :key="message.id" class="flex flex-col">
      <div class="flex gap-4">
        <div class="w-10 h-10 flex items-center justify-center flex-shrink-0">
          <LogoIcon :size="36" color="var(--color-logo-gray)" />
        </div>
        <div class="flex-1">
          <!-- Render conversation items dynamically -->
          <template v-for="item in message.items" :key="item.id">
            <TextParagraph v-if="item.type === 'text'" :item="item" />
            <SearchHintsGroup
              v-else-if="item.type === 'hints-group'"
              :item="item"
            />
            <ResultsSummary
              v-else-if="item.type === 'results-summary'"
              :item="item"
            />
            <SearchRefinement
              v-else-if="item.type === 'refinement'"
              :item="item"
            />
            <ActionButton
              v-else-if="item.type === 'action-button'"
              :item="item"
            />
            <FileUpload v-else-if="item.type === 'file-upload'" :item="item" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LogoIcon from '@/components/icons/LogoIcon.vue'
  import TextParagraph from './conversation/TextParagraph.vue'
  import SearchHintsGroup from './conversation/SearchHintsGroup.vue'
  import ResultsSummary from './conversation/ResultsSummary.vue'
  import SearchRefinement from './conversation/SearchRefinement.vue'
  import ActionButton from './conversation/ActionButton.vue'
  import FileUpload from './conversation/FileUpload.vue'
  import type { SearchConversationProps } from '@/types/conversation'

  interface Props extends SearchConversationProps {
    // Additional props can be added here
  }

  defineProps<Props>()
</script>
