<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="bg-bg-card rounded-lg border border-border-light p-6">
    <!-- Name and Tags Section -->
    <div class="flex items-center flex-wrap gap-3 mb-6">
      <!-- Green Status Indicator -->
      <div
        class="w-8 h-8 bg-green-500 rounded-full border-2 border-white"
      ></div>

      <h1 class="text-xl font-semibold text-text-primary">
        {{ person.name }}
      </h1>
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="tag in person.tags"
          :key="tag"
          variant="outline"
          size="sm"
          :active="activeTag === tag"
          @click="handleTagClick(tag)"
        >
          {{ tag }}
        </Button>
      </div>
    </div>

    <!-- Separator Border -->
    <div class="flex justify-center mb-6">
      <div class="w-full border-t border-dashed border-border-dashed"></div>
    </div>

    <div class="flex items-start gap-6 mb-6">
      <!-- Profile Image -->
      <div class="flex-shrink-0 mr-4">
        <img
          :src="person.profileImage || '/placeholder-profile.jpg'"
          :alt="`${person.name} profile`"
          class="w-40 h-32 object-cover rounded-lg bg-gray-200"
        />
      </div>

      <!-- Description and Additional Info -->
      <div class="flex-1">
        <div class="text-text-secondary leading-relaxed mb-4">
          <span
            v-html="
              sanitizeHtml(formatDescription(person.description, person.name))
            "
          ></span>
          <button
            class="ml-1 text-brand-orange hover:underline cursor-pointer"
            @click="toggleReadMore"
          >
            {{ isExpanded ? 'Show Less' : 'Read More' }}
          </button>
        </div>

        <!-- Additional Info Section -->
        <div class="flex items-center gap-3 text-sm">
          <span
            class="bg-bg-card border border-dashed border-border-dashed px-4 py-2 rounded-full text-text-secondary"
            >American</span
          >
          <span
            class="bg-bg-card border border-dashed border-border-dashed px-4 py-2 rounded-full text-text-secondary"
            >DOB - 10 Aug 2000</span
          >
          <button class="text-brand-orange hover:underline">
            Login for more details →
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Separator Border -->
    <div class="flex justify-center">
      <div class="w-full border-t border-dashed border-border-dashed"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import Button from '@/components/ui/Button.vue'
  import { sanitizeHtml, safeHighlight } from '@/utils/sanitize'

  interface Person {
    name: string
    tags: string[]
    description: string
    profileImage?: string
  }

  interface Props {
    person: Person
  }

  interface Emits {
    (_e: 'tagClick', _tag: string): void
  }

  defineProps<Props>()
  const emit = defineEmits<Emits>()

  const isExpanded = ref(false)
  const activeTag = ref('Overview')

  const handleTagClick = (tag: string) => {
    activeTag.value = tag
    emit('tagClick', tag)
  }

  const toggleReadMore = () => {
    isExpanded.value = !isExpanded.value
  }

  const formatDescription = (description: string, name: string) => {
    // Safely highlight the person's name in the description
    return safeHighlight(description, name)
  }
</script>
