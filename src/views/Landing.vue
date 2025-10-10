<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col relative overflow-hidden"
  >
    <!-- Decorative Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-0 -left-4 w-72 h-72 bg-brand-accent opacity-10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"
      ></div>
      <div
        class="absolute top-0 -right-4 w-72 h-72 bg-purple-300 opacity-10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 opacity-10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"
      ></div>
    </div>

    <div
      class="flex-1 flex flex-col max-w-6xl mx-auto px-8 py-12 relative z-10 md:px-4"
    >
      <!-- Logo -->
      <div class="flex justify-center mb-16 animate-fade-in">
        <Logo />
      </div>

      <!-- Main Content -->
      <div
        class="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto"
      >
        <div class="space-y-6 mb-12 animate-slide-in">
          <h1
            class="text-6xl font-extrabold text-brand-primary leading-tight md:text-5xl sm:text-4xl"
          >
            Hi
            <span
              class="bg-gradient-to-r from-brand-accent to-purple-600 bg-clip-text text-transparent"
              >Robert</span
            >!
          </h1>
          <h2 class="text-4xl font-bold text-slate-700 md:text-3xl sm:text-2xl">
            What are you
            <span class="text-brand-accent">interested in</span> now?
          </h2>
          <p
            class="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Try adding more detail—works better when you give more context or
            share your goal
          </p>
        </div>

        <!-- Search Bar -->
        <div
          class="w-full max-w-3xl animate-fade-in"
          style="animation-delay: 0.2s"
        >
          <div class="relative">
            <SearchBar
              v-model="searchQuery"
              placeholder="Enter keyword of the person you want to know or explain the person you are looking for..."
              :disabled="searchStore.isLoading"
              @search="handleSearch"
              @file-upload="handleFileUpload"
              @file-error="handleFileError"
              @speech-error="handleSpeechError"
            />
          </div>

          <!-- Loading Spinner -->
          <div v-if="searchStore.isLoading" class="flex justify-center mt-6">
            <div class="relative">
              <div
                class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200"
              ></div>
              <div
                class="animate-spin rounded-full h-12 w-12 border-4 border-brand-accent border-t-transparent absolute top-0 left-0"
              ></div>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="searchStore.error"
            class="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-fade-in"
          >
            <div class="flex items-center gap-2">
              <svg
                class="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ searchStore.error }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Start Hints -->
        <div
          class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl animate-fade-in"
          style="animation-delay: 0.4s"
        >
          <div
            class="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:shadow-xl-modern transition-all hover:-translate-y-1"
          >
            <div class="text-brand-accent mb-3">
              <svg
                class="w-8 h-8 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-slate-800 mb-2">Search Anyone</h3>
            <p class="text-sm text-slate-600">
              Find comprehensive information about any person instantly
            </p>
          </div>

          <div
            class="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:shadow-xl-modern transition-all hover:-translate-y-1"
          >
            <div class="text-purple-500 mb-3">
              <svg
                class="w-8 h-8 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-slate-800 mb-2">Upload Files</h3>
            <p class="text-sm text-slate-600">
              Add documents or images for better context and results
            </p>
          </div>

          <div
            class="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:shadow-xl-modern transition-all hover:-translate-y-1"
          >
            <div class="text-emerald-500 mb-3">
              <svg
                class="w-8 h-8 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-slate-800 mb-2">Fast Results</h3>
            <p class="text-sm text-slate-600">
              Get instant, comprehensive reports with actionable insights
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Page Footer -->
    <CopyrightFooter @pi-click="handlePiClick" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSearchStore } from '@/stores/search'
  import { useConversationStore } from '@/stores/conversation'
  import Logo from '@/components/common/Logo.vue'
  import SearchBar from '@/components/common/SearchBar.vue'
  import CopyrightFooter from '@/components/layout/CopyrightFooter.vue'

  const router = useRouter()
  const searchStore = useSearchStore()
  const conversationStore = useConversationStore()
  const searchQuery = ref('')

  const handleSearch = async () => {
    if (!searchQuery.value.trim()) {
      return
    }

    try {
      // Clear previous conversation when starting a new search from landing
      conversationStore.clearConversation()

      await searchStore.performSearch(searchQuery.value)
      // Navigate to dashboard for default Robert Schmidt
      const ROBERT_SCHMIDT_1_ID = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b'
      await router.push(`/dashboard/${ROBERT_SCHMIDT_1_ID}`)
    } catch {
      // TODO: Implement proper error handling/logging
      // console.error('Search failed:', error)
    }
  }

  const handleFileUpload = (_files: File[]) => {
    // TODO: Implement file upload handling
    // console.log('Files uploaded:', files)
  }

  const handleFileError = (_error: string) => {
    // TODO: Implement proper error handling UI
    // TODO: Implement proper error handling UI instead of console.error
    // For now, you could show a toast notification or set an error state
  }

  const handleSpeechError = (_error: string) => {
    // TODO: Implement proper speech error handling UI
    // For now, errors are handled by the SearchBar component itself
    // In future, could show toast notifications or set error state
  }

  function handlePiClick() {
    // This function is kept for event binding compatibility but not used
  }
</script>

<style scoped>
  @keyframes blob {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
  }

  .animate-blob {
    animation: blob 7s infinite;
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .animation-delay-4000 {
    animation-delay: 4s;
  }
</style>
