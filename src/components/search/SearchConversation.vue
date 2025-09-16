<template>
  <div class="px-8 py-8">
    <!-- Render all messages (both user and system) -->
    <template v-for="message in messages" :key="message.id">
      <!-- User Message -->
      <UserMessage
        v-if="message.sender === 'user'"
        :content="message.content"
      />

      <!-- System Message -->
      <div v-else-if="message.sender === 'system'" class="flex flex-col">
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
              <FileUpload
                v-else-if="item.type === 'file-upload'"
                :item="item"
              />
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import LogoIcon from '@/components/icons/LogoIcon.vue'
  import UserMessage from './conversation/UserMessage.vue'
  import TextParagraph from './conversation/TextParagraph.vue'
  import SearchHintsGroup from './conversation/SearchHintsGroup.vue'
  import ResultsSummary from './conversation/ResultsSummary.vue'
  import SearchRefinement from './conversation/SearchRefinement.vue'
  import ActionButton from './conversation/ActionButton.vue'
  import FileUpload from './conversation/FileUpload.vue'
  import type { ConversationMessage } from '@/types/conversation'

  interface Props {
    messages: ConversationMessage[]
  }

  defineProps<Props>()
</script>
