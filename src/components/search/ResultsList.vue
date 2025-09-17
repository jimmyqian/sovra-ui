<template>
  <div class="w-full bg-bg-primary flex flex-col md:flex-1 md:h-auto">
    <div class="flex-1 px-8 py-4 overflow-y-auto md:px-4">
      <!-- Error state -->
      <div v-if="error" class="flex items-center justify-center py-12">
        <div class="text-red-500">Error: {{ error }}</div>
      </div>

      <!-- Loading state for initial search -->
      <div
        v-else-if="isLoading && results.length === 0"
        class="flex items-center justify-center py-12"
      >
        <div class="text-text-secondary">Loading results...</div>
      </div>

      <!-- Results -->
      <div v-else-if="results.length > 0">
        <ResultCard
          v-for="result in results"
          :key="result.id"
          :result="result"
          @person-selected="handlePersonSelected"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="flex items-center justify-center py-12">
        <div class="text-text-secondary">
          No results found. Try a different search.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ResultCard from './ResultCard.vue'
  import type { SearchResult } from '@/types/search'

  interface Props {
    results: SearchResult[]
    isLoading?: boolean
    error?: string | null
  }

  interface Emits {
    (_e: 'personSelected', _person: SearchResult): void
  }

  withDefaults(defineProps<Props>(), {
    error: null
  })
  const emit = defineEmits<Emits>()

  const handlePersonSelected = (person: SearchResult) => {
    emit('personSelected', person)
  }
</script>
