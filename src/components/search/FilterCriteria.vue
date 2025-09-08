<template>
  <div class="filter-tags">
    <span
      v-for="filter in filters"
      :key="filter.id"
      class="filter-tag"
      :class="{ 'has-dropdown': filter.hasDropdown }"
    >
      {{ filter.text }}
      <button
        v-if="filter.removable"
        class="remove-tag"
        @click="handleRemoveFilter(filter.id)"
      >
        ×
      </button>
      <span
        v-if="filter.hasDropdown"
        class="dropdown"
        @click="handleDropdownClick(filter.id)"
      >
        {{ filter.dropdownText }} ▼
      </span>
    </span>
    <button class="edit-btn" @click="handleEdit">edit ✏️</button>
    <button class="create-criteria-btn" @click="handleCreateMore">
      🔍 Create more criteria
    </button>
  </div>
</template>

<script setup lang="ts">
  interface FilterItem {
    id: string
    text: string
    removable?: boolean
    hasDropdown?: boolean
    dropdownText?: string
  }

  interface Props {
    filters: FilterItem[]
  }

  interface Emits {
    (e: 'removeFilter', filterId: string): void
    (e: 'dropdownClick', filterId: string): void
    (e: 'edit'): void
    (e: 'createMore'): void
  }

  defineProps<Props>()
  const emit = defineEmits<Emits>()

  const handleRemoveFilter = (filterId: string) => {
    emit('removeFilter', filterId)
  }

  const handleDropdownClick = (filterId: string) => {
    emit('dropdownClick', filterId)
  }

  const handleEdit = () => {
    emit('edit')
  }

  const handleCreateMore = () => {
    emit('createMore')
  }
</script>

<style scoped>
  .filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .filter-tag {
    background: #f8f9fa;
    padding: 0.25rem 0.75rem;
    border-radius: 16px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .filter-tag.has-dropdown {
    cursor: pointer;
  }

  .dropdown {
    cursor: pointer;
    font-weight: 500;
  }

  .dropdown:hover {
    color: #ff6b35;
  }

  .remove-tag {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
    margin-left: 0.25rem;
  }

  .remove-tag:hover {
    color: #ff6b35;
  }

  .edit-btn,
  .create-criteria-btn {
    background: none;
    border: 1px solid #ddd;
    padding: 0.25rem 0.75rem;
    border-radius: 16px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .edit-btn:hover {
    border-color: #999;
    background: #f8f9fa;
  }

  .create-criteria-btn {
    color: #ff6b35;
    border-color: #ff6b35;
  }

  .create-criteria-btn:hover {
    background: #ff6b35;
    color: white;
  }

  @media (max-width: 768px) {
    .filter-tags {
      gap: 0.25rem;
    }

    .filter-tag,
    .edit-btn,
    .create-criteria-btn {
      font-size: 0.8rem;
      padding: 0.2rem 0.6rem;
    }
  }
</style>
