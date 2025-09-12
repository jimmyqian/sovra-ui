<template>
  <div class="space-y-6">
    <!-- Activity Log -->
    <div class="bg-bg-card border border-border-light rounded-lg p-6">
      <h3 class="font-semibold text-text-primary mb-4">Activity Log</h3>
      <div class="text-sm text-text-secondary">
        Recent activity and data updates will appear here...
      </div>
    </div>

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
      >
        Show all references
      </button>
    </div>

    <!-- Copyright Footer -->
    <div class="text-center pt-6 border-t border-border-light">
      <p class="text-xs text-text-muted">© {{ currentYear }} Sovra.ai</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'

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

  const currentYear = computed(() => new Date().getFullYear())

  const toggleCategory = (categoryId: string) => {
    const category = referenceCategories.value.find(
      cat => cat.id === categoryId
    )
    if (category) {
      category.active = !category.active
    }
  }

  interface Emits {
    (e: 'categoryToggle', categoryId: string, active: boolean): void
    (e: 'showReferences'): void
  }

  const emit = defineEmits<Emits>()

  const _handleCategoryToggle = (categoryId: string) => {
    const category = referenceCategories.value.find(
      cat => cat.id === categoryId
    )
    if (category) {
      emit('categoryToggle', categoryId, category.active)
    }
  }

  const _handleShowReferences = () => {
    emit('showReferences')
  }
</script>
