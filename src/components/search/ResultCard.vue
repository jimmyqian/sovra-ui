<template>
  <div
    class="bg-bg-card rounded-xl p-6 mb-4 flex items-center gap-4 shadow-card md:flex-col md:items-start"
  >
    <div class="w-15 h-15 bg-border-lighter rounded-full flex-shrink-0"></div>
    <div class="flex-1">
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
        <div class="w-25 h-1 bg-border-lighter rounded overflow-hidden">
          <div
            class="h-full bg-brand-orange transition-all duration-300"
            :style="{ width: (result.rating / 5) * 100 + '%' }"
          ></div>
        </div>
        <span class="text-sm font-semibold text-text-primary">{{
          result.rating
        }}</span>
      </div>
    </div>
    <div class="flex gap-8 md:gap-4">
      <div class="text-center">
        <span class="block text-2xl font-semibold text-text-primary">{{
          result.references
        }}</span>
        <span class="text-xs text-text-secondary leading-tight"
          >References<br />across Web</span
        >
      </div>
      <div class="text-center">
        <span class="block text-2xl font-semibold text-text-primary">{{
          result.companies
        }}</span>
        <span class="text-xs text-text-secondary leading-tight"
          >companies<br />associated with</span
        >
      </div>
      <div class="text-center">
        <span class="block text-2xl font-semibold text-text-primary">{{
          result.contacts
        }}</span>
        <span class="text-xs text-text-secondary leading-tight"
          >Contacts<br />available</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface SearchResult {
    id: number
    name: string
    age: number
    gender: string
    maritalStatus: string
    location: string
    rating: number
    references: number
    companies: number
    contacts: number
  }

  interface Props {
    result: SearchResult
  }

  defineProps<Props>()
</script>
