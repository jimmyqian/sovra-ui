<template>
  <div class="space-y-6">
    <!-- Reference Categories -->
    <div class="flex flex-wrap gap-3 justify-center">
      <button
        v-for="category in referenceCategories"
        :key="category.id"
        class="px-4 py-2 rounded-full text-sm border transition-colors"
        :class="
          category.active
            ? 'bg-brand-orange text-white border-brand-orange'
            : 'bg-bg-card text-text-secondary border-border-light hover:border-brand-orange hover:text-brand-orange'
        "
        @click="toggleCategory(category.id)"
      >
        {{ category.label }}
      </button>
    </div>

    <!-- Show References Button -->
    <div class="text-center">
      <button
        class="px-6 py-2 rounded-full border border-brand-orange text-brand-orange text-sm transition-colors hover:bg-brand-orange hover:text-white"
        @click="handleShowReferences"
      >
        Show all references
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  interface ReferenceCategory {
    id: string
    label: string
    active: boolean
  }

  const referenceCategories = ref<ReferenceCategory[]>([
    { id: 'loans', label: 'Loans / Deposits', active: false },
    { id: 'travels', label: 'Travels', active: false },
    { id: 'events', label: 'Events', active: false },
    { id: 'vehicles', label: 'Vehicles', active: false },
    { id: 'averagePay', label: 'Average Pay', active: true },
    { id: 'timeLine', label: 'Time Line View', active: false },
    { id: 'ssnFinance', label: 'SSN & Finance', active: false }
  ])

  interface Emits {
    (_e: 'categoryToggle', _categoryId: string, _active: boolean): void
    (_e: 'showReferences'): void
  }

  const emit = defineEmits<Emits>()

  const toggleCategory = (categoryId: string) => {
    const category = referenceCategories.value.find(
      cat => cat.id === categoryId
    )
    if (category) {
      category.active = !category.active
      emit('categoryToggle', categoryId, category.active)
    }
  }

  const handleShowReferences = () => {
    emit('showReferences')
  }
</script>
