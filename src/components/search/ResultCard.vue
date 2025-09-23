<template>
  <div
    class="result-card cursor-pointer transition-all duration-200 hover:shadow-card hover:bg-bg-secondary"
    @click="handlePersonSelect"
  >
    <div class="flex items-start gap-4 flex-1 md:min-w-80">
      <div class="w-15 h-15 rounded-full flex-shrink-0 overflow-hidden">
        <img
          :src="result.image ?? 'https://picsum.photos/240/240?random=1'"
          alt="Profile"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-xl font-semibold mb-2 text-text-primary">
          {{ result.name }}
        </h3>
        <div class="flex gap-4 mb-3 text-sm text-text-secondary">
          <span class="age">{{ result.age }} Years</span>
          <span class="gender">{{ result.gender }}</span>
          <span class="status">{{ result.maritalStatus }}</span>
          <span class="location">{{ result.location }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-text-secondary">Sovra Rating</span>
          <ScoreBar :rating="result.rating" />
          <span class="text-sm font-semibold text-text-primary">{{
            result.rating
          }}</span>
        </div>
      </div>
    </div>
    <div class="flex gap-4 md:gap-8 w-full md:w-auto md:min-w-72 self-end">
      <div class="stat-item border-l border-border-lighter pl-4 md:pl-8">
        <span class="stat-number">{{ result.references }}</span>
        <span class="stat-label">References<br />across Web</span>
      </div>
      <div class="stat-item border-l border-border-lighter pl-4 md:pl-8">
        <span class="stat-number">{{ result.companies }}</span>
        <span class="stat-label">companies<br />associated with</span>
      </div>
      <div class="stat-item border-l border-border-lighter pl-4 md:pl-8">
        <span class="stat-number">{{ result.contacts }}</span>
        <span class="stat-label">Contacts<br />available</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { SearchResult } from '@/types/search'
  import ScoreBar from '@/components/common/ScoreBar.vue'

  interface Props {
    result: SearchResult
  }

  interface Emits {
    (_e: 'personSelected', _person: SearchResult): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const handlePersonSelect = () => {
    emit('personSelected', props.result)
  }
</script>
