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
        />
      </div>

      <!-- Empty state -->
      <div v-else class="flex items-center justify-center py-12">
        <div class="text-text-secondary">
          No results found. Try a different search.
        </div>
      </div>
    </div>

    <div v-if="hasMore" class="px-8 py-4 text-center md:px-4">
      <Button
        variant="outline"
        size="lg"
        :disabled="isLoading"
        class="mx-auto"
        @click="handleLoadMore"
      >
        {{ isLoading ? 'Loading...' : 'Load More Results' }}
        <MoreIcon v-if="!isLoading" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Button from '@/components/ui/Button.vue'
  import ResultCard from './ResultCard.vue'
  import MoreIcon from '@/components/icons/MoreIcon.vue'
  import type { SearchResult } from '@/types/search'

  interface Props {
    results: SearchResult[]
    isLoading?: boolean
    hasMore?: boolean
    error?: string | null
  }

  interface Emits {
    (_e: 'loadMore'): void
    (_e: 'load-more'): void
  }

  withDefaults(defineProps<Props>(), {
    error: null
  })
  const emit = defineEmits<Emits>()

  const handleLoadMore = () => {
    emit('loadMore')
  }
</script>
