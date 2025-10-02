<template>
  <SearchLayout
    search-placeholder="Tell me more about who you're looking for"
    @search="handleSearch"
    @file-upload="handleFileUpload"
    @speech-error="handleSpeechError"
  >
    <!-- Upsell Popup -->
    <UpsellPopup
      v-model="showUpsellPopup"
      @upgrade="handleUpgrade"
      @maybe-later="handleMaybeLater"
    />
    <!-- Right Panel: Person Details -->
    <div class="flex-1 flex flex-col max-h-full overflow-hidden relative">
      <div
        ref="detailScrollContainer"
        class="flex-1 overflow-y-auto max-h-full detail-scroll"
        @scroll="handleDetailScroll"
      >
        <!-- Back Navigation -->
        <div class="flex items-center gap-2 p-6 pb-0">
          <button
            class="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
            @click="handleBackToSearch"
          >
            <ChevronLeftIcon />
            <span>Back to Search Results</span>
          </button>
        </div>

        <main class="p-6 space-y-6">
          <!-- Person Profile Section -->
          <PersonProfile
            :person="{
              ...personProfile,
              profileImage: detailedPerson.profileImage
            }"
            @tag-click="handleTagClick"
          />

          <!-- Detailed Information -->
          <DetailedResultCard
            :person="detailedPerson"
            @show-upsell="handleShowUpsell"
          />

          <!-- Category Tabs -->
          <CategoryTabs
            :personal-data="categoryData.personal"
            :professional-data="categoryData.professional"
            :finance-data="categoryData.finance"
            :legal-data="categoryData.legal"
            @show-upsell="handleShowUpsell"
          />

          <!-- Activity Footer -->
          <ActivityFooter
            @category-toggle="handleCategoryToggle"
            @show-references="handleShowReferences"
          />
        </main>

        <!-- Page Footer -->
        <CopyrightFooter @pi-click="handlePiClick" />
      </div>

      <!-- Fade-out gradient overlay at top - shows when scrolled -->
      <div class="fade-overlay-top" :class="[{ visible: showTopFade }]"></div>
      <!-- Fade-out gradient overlay at bottom - fixed to viewport -->
      <div class="fade-overlay"></div>

      <!-- Scroll Control Chevrons -->
      <ChevronUpIcon
        v-if="hasScrollableContent && canScrollUp"
        class="scroll-chevron scroll-chevron-top cursor-pointer"
        aria-label="Scroll to top"
        @click="scrollDetailToTop"
      />
      <ChevronDownIcon
        v-if="hasScrollableContent && canScrollDown"
        class="scroll-chevron scroll-chevron-bottom cursor-pointer"
        aria-label="Scroll to bottom"
        @click="scrollDetailToBottom"
      />
    </div>
  </SearchLayout>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch, nextTick } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useConversationStore } from '@/stores/conversation'
  import { useSearchStore } from '@/stores/search'
  import { useSubscriptionStore } from '@/stores/subscription'
  import { useUIStore } from '@/stores/ui'
  import SearchLayout from '@/components/layouts/SearchLayout.vue'
  import PersonProfile from '@/components/search/PersonProfile.vue'
  import DetailedResultCard from '@/components/search/DetailedResultCard.vue'
  import CategoryTabs from '@/components/search/CategoryTabs.vue'
  import ActivityFooter from '@/components/search/ActivityFooter.vue'
  import CopyrightFooter from '@/components/layout/CopyrightFooter.vue'
  import ChevronUpIcon from '@/components/icons/ChevronUpIcon.vue'
  import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
  import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue'
  import UpsellPopup from '@/components/common/UpsellPopup.vue'

  const route = useRoute()
  const router = useRouter()
  const conversationStore = useConversationStore()
  const searchStore = useSearchStore()
  const subscriptionStore = useSubscriptionStore()
  const uiStore = useUIStore()
  const detailScrollContainer = ref<HTMLElement | null>(null)

  // Detail panel scroll state
  const showTopFade = ref(false)
  const canScrollUp = ref(false)
  const canScrollDown = ref(false)
  const hasScrollableContent = ref(false)

  // Upsell popup state
  const showUpsellPopup = ref(false)

  // Get person data from route params and search store
  const personId = computed(() => route.params.id as string)
  const selectedPerson = computed(() => {
    if (personId.value) {
      return searchStore.findPersonById(personId.value)
    }
    return null
  })

  // Use the person's actual name or fallback to "Unknown Person"
  const personName = computed(
    () => selectedPerson.value?.name ?? 'Unknown Person'
  )

  // Mock data - in real app this would come from API based on route params
  const personProfile = computed(() => ({
    name: personName.value,
    tags: [
      'Overview',
      'Personal Life',
      'Professional Life',
      'Finance',
      'Health'
    ],
    description: `${personName.value} is an American businessman, inventor, and investor best known for co-founding the technology company ABC Inc. ${personName.value} was also the founder of NeXT and chairman and majority shareholder of Pixar...`
  }))

  const detailedPerson = computed(() => ({
    name: personName.value,
    profileImage:
      'https://raw.githubusercontent.com/imcnaney/donkey/main/img/i3.png',
    images: [
      'https://raw.githubusercontent.com/imcnaney/donkey/main/img/i1.png',
      'https://raw.githubusercontent.com/imcnaney/donkey/main/img/i2.png',
      'https://raw.githubusercontent.com/imcnaney/donkey/main/img/i3.png',
      'https://raw.githubusercontent.com/imcnaney/donkey/main/img/i4.png',
      'https://raw.githubusercontent.com/imcnaney/donkey/main/img/i5.png',
      'https://raw.githubusercontent.com/imcnaney/donkey/main/img/i6.png',
      'https://raw.githubusercontent.com/imcnaney/donkey/main/img/i7.png'
    ],
    imageCount: 21,
    stats: {
      age: '26',
      netWorth: '$1.890 M USD (2022)'
    },
    personal: {
      birthDate: '10 Aug 2000',
      birthPlace: 'Pretoria, Washington, USA',
      spouse: 'Justine m. 2023-2025',
      currentLocation: 'Phoenix, AZ, USA',
      height: '176 CMs',
      weight: '67 KG',
      education: {
        university: 'University of Pennsylvania School of Arts and Sciences',
        degree: '(1997)',
        year: '1997'
      }
    },
    professional: {
      currentJob: 'Software Engineer',
      avgPay: '$120,000/year',
      currentEmployer: 'ABC Technology Inc.',
      timeInField: '5 years',
      boards: 'Tech Advisory Board'
    },
    finance: {
      worth: '$156M+ 67 M USD',
      creditScore: '750',
      housingStatus: 'Own',
      houseWorth: '$850,000',
      businessEntities: '2 LLCs',
      businessStatus: 'Active'
    },
    legal: {
      newsArticles: '45 articles',
      bankruptcies: 'None',
      childSupport: 'N/A',
      crimes: 'None',
      allegations: 'None'
    }
  }))

  const categoryData = ref({
    personal: {
      relationshipStatus: 'Married',
      children: '2 children',
      interests: 'Technology, Space Exploration, AI'
    },
    professional: {
      industry: 'Technology',
      experience: '12+ years',
      previousCompanies: 'PayPal, Tesla, SpaceX'
    },
    finance: {
      annualIncome: '$2.5M+',
      investments: 'Tesla, SpaceX, Neuralink',
      propertyValue: '$100M+'
    },
    legal: {
      backgroundCheck: 'Clear',
      courtRecords: 'None',
      licenses: 'Professional Engineer License'
    }
  })

  const handleDetailScroll = () => {
    if (detailScrollContainer.value) {
      const container = detailScrollContainer.value
      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight

      // Show top fade when scrolled more than 20px from top
      showTopFade.value = scrollTop > 20

      // Update scroll button states
      canScrollUp.value = scrollTop > 0
      canScrollDown.value = scrollTop < scrollHeight - clientHeight
      hasScrollableContent.value = scrollHeight > clientHeight
    }
  }

  const scrollDetailToTop = () => {
    if (detailScrollContainer.value) {
      const currentScroll = detailScrollContainer.value.scrollTop
      const scrollAmount = 200 // Approximately 1.5 card heights
      detailScrollContainer.value.scrollTo({
        top: Math.max(0, currentScroll - scrollAmount),
        behavior: 'smooth'
      })
    }
  }

  const scrollDetailToBottom = () => {
    if (detailScrollContainer.value) {
      const currentScroll = detailScrollContainer.value.scrollTop
      const scrollAmount = 200 // Approximately 1.5 card heights
      const maxScroll =
        detailScrollContainer.value.scrollHeight -
        detailScrollContainer.value.clientHeight
      detailScrollContainer.value.scrollTo({
        top: Math.min(maxScroll, currentScroll + scrollAmount),
        behavior: 'smooth'
      })
    }
  }

  const handleBackToSearch = () => {
    // Navigate back to search results
    router.push('/search')
  }

  const handleSearch = async (_query: string) => {
    // Search handling is now done by ConversationPanel component
    // This is just for any additional logic specific to SearchDetail
  }

  const handleFileUpload = (_files: File[]) => {
    // TODO: Implement file upload functionality
    // console.log('Files uploaded:', files)
    // Implement file upload functionality
  }

  const handleCategoryToggle = (_categoryId: string, _active: boolean) => {
    // TODO: Implement category toggle functionality
    // console.log('Category toggled:', categoryId, active)
    // Implement category toggle functionality
  }

  const handleShowReferences = () => {
    // TODO: Implement show references functionality
    // console.log('Show references clicked')
    // Implement show references functionality
  }

  const handleTagClick = (_tag: string) => {
    // TODO: Implement tag navigation functionality
    // console.log('Tag clicked:', tag)
    // Implement tag navigation functionality - could scroll to section or change view
  }

  const handleSpeechError = (_error: string) => {
    // TODO: Implement proper speech error handling UI
    // For now, errors are handled by the SearchBar component itself
    // In future, could show toast notifications or set error state
  }

  const handleHintClick = (_hintType: string) => {
    // TODO: Implement hint click functionality
    // console.log('Hint clicked:', hintType)
    // TODO: Implement hint click functionality
  }

  const handleCreateFilter = () => {
    // TODO: Implement filter creation
    // console.log('Create filter clicked')
    // TODO: Implement filter creation
  }

  // Upsell popup handlers
  const handleUpgrade = () => {
    // TODO: Implement actual upgrade flow
    // In real app, navigate to subscription/payment page
  }

  const handleMaybeLater = () => {
    // Maybe track this for remarketing/follow-up
  }

  const handleShowUpsell = () => {
    // Only show upsell popup if it hasn't been shown before in this session
    if (uiStore.canShowUpsellPopup()) {
      showUpsellPopup.value = true
      uiStore.markUpsellPopupShown()
    }
  }

  function handlePiClick() {
    // This function is kept for event binding compatibility but not used
  }

  onMounted(() => {
    // Initialize hint handlers on mount
    conversationStore.updateHintHandlers({
      onHintClick: handleHintClick,
      onCreateFilter: handleCreateFilter
    })

    // Initialize detail script using the original search query
    // Only initialize if we have an original query and haven't initialized detail script yet
    if (conversationStore.originalQuery && !conversationStore.detailScript) {
      conversationStore.initializeDetailScript(conversationStore.originalQuery)
    }

    // Load person data based on route params
    const personId = route.params.id as string
    if (personId) {
      // TODO: Load person data for production
      // In real app: loadPersonData(personId)
    }

    // If conversation is empty (cleared from landing), rebuild the default conversation
    if (
      conversationStore.conversationHistory.length === 0 &&
      searchStore.currentQuery
    ) {
      // Rebuild the default conversation with the current search query
      conversationStore.addMessage({
        id: 'user-message-1',
        sender: 'user',
        timestamp: new Date(),
        content: searchStore.currentQuery
      })

      conversationStore.addMessage({
        id: 'system-response-1',
        sender: 'system',
        timestamp: new Date(),
        items: [
          {
            id: 'results-summary',
            type: 'results-summary',
            resultCount: searchStore.displayTotalResults
          },
          {
            id: 'text-1',
            type: 'text',
            content:
              "Alternatively, you can use the hints below for finding the person you're looking for.",
            emphasis: 'secondary'
          },
          {
            id: 'hints-group-1',
            type: 'hints-group',
            hints: [
              {
                text: `What specific details about ${searchStore.currentQuery} can help narrow the search`,
                onClick: () => {}
              },
              {
                text: `Location or workplace information for ${searchStore.currentQuery}`,
                onClick: () => {}
              },
              {
                text: `Additional context about ${searchStore.currentQuery}`,
                onClick: () => {}
              }
            ]
          },
          {
            id: 'text-2',
            type: 'text',
            content:
              'Or include further information, such as any documents you may have about him, web links, pictures, or videos; if so, submit them by using the upload option.',
            emphasis: 'secondary'
          },
          {
            id: 'action-button-1',
            type: 'action-button',
            text: 'create a filter using the details that you provided',
            variant: 'dashed',
            onClick: () => {}
          }
        ]
      })
    }

    // Show upsell popup when user navigates to detail page
    // Only show if user is not already at maximum subscription level
    // and hasn't seen the popup before in this session
    // Small delay to let the page render first
    setTimeout(() => {
      if (subscriptionStore.currentLevel < 3 && uiStore.canShowUpsellPopup()) {
        showUpsellPopup.value = true
        uiStore.markUpsellPopupShown()
      }
    }, 1000)

    // Initialize scroll state
    nextTick(() => {
      handleDetailScroll()
    })
  })

  // Watch for changes in content to update scroll state
  watch(
    [personProfile, detailedPerson, categoryData],
    () => {
      // Check scroll state after content update
      nextTick(() => {
        handleDetailScroll()
      })
    },
    { deep: true, immediate: true }
  )

  // Expose methods for testing
  defineExpose({
    handleShowUpsell
  })
</script>

<style scoped>
  .fade-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 160px; /* Fixed height instead of percentage */
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgb(248 248 248) 100%
    );
    pointer-events: none;
    z-index: 10;
  }

  .fade-overlay-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 160px; /* Same height as bottom fade */
    background: linear-gradient(to top, transparent 0%, rgb(248 248 248) 100%);
    pointer-events: none;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .fade-overlay-top.visible {
    opacity: 1;
  }

  /* Hide scrollbars on detail panel */
  .detail-scroll {
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  /* Scroll control chevrons */
  .scroll-chevron {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 24px;
    color: var(--color-brand-orange);
    transition: all 0.2s ease;
    z-index: 20;
  }

  .scroll-chevron:hover {
    color: #e55a2e; /* darker orange on hover */
    transform: translateX(-50%) scale(1.1);
  }

  .scroll-chevron:active {
    transform: translateX(-50%) scale(0.95);
  }

  .scroll-chevron-top {
    top: 16px;
  }

  .scroll-chevron-bottom {
    bottom: 16px;
  }
</style>
