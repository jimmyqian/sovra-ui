<template>
  <div class="min-h-screen bg-bg-primary flex flex-col">
    <div class="flex-1 flex h-screen">
      <!-- Left Navigation Sidebar -->
      <AppSidebar />

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col md:flex-row">
        <!-- Left Panel: Search & Conversation -->
        <div class="w-full bg-bg-card flex flex-col md:w-2/5 md:h-full">
          <AppHeader />
          <SearchConversation
            :messages="conversationMessages"
            :user-query="searchQuery"
          />

          <!-- Search Input -->
          <div class="px-8 py-4 md:px-4">
            <SearchBar
              v-model="searchQuery"
              placeholder="Johnson, who is around 26 years old, works in a software company in California"
              @search="handleSearch"
              @file-upload="handleFileUpload"
              @speech-error="handleSpeechError"
            />
          </div>

          <!-- Spacer to push content up and search box immediately after content -->
          <div class="flex-1"></div>
        </div>

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
              <DetailedResultCard :person="detailedPerson" />

              <!-- Category Tabs -->
              <CategoryTabs
                :personal-data="categoryData.personal"
                :professional-data="categoryData.professional"
                :finance-data="categoryData.finance"
                :legal-data="categoryData.legal"
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
          <div
            class="fade-overlay-top"
            :class="[{ visible: showTopFade }]"
          ></div>
          <!-- Fade-out gradient overlay at bottom - fixed to viewport -->
          <div class="fade-overlay"></div>

          <!-- Scroll Control Buttons -->
          <button
            v-if="hasScrollableContent && canScrollUp"
            class="scroll-button scroll-button-top"
            aria-label="Scroll to top"
            @click="scrollDetailToTop"
          >
            <ChevronUpIcon />
          </button>
          <button
            v-if="hasScrollableContent && canScrollDown"
            class="scroll-button scroll-button-bottom"
            aria-label="Scroll to bottom"
            @click="scrollDetailToBottom"
          >
            <ChevronDownIcon />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch, nextTick } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import AppHeader from '@/components/layout/AppHeader.vue'
  import AppSidebar from '@/components/navigation/AppSidebar.vue'
  import SearchBar from '@/components/common/SearchBar.vue'
  import SearchConversation from '@/components/search/SearchConversation.vue'
  import PersonProfile from '@/components/search/PersonProfile.vue'
  import DetailedResultCard from '@/components/search/DetailedResultCard.vue'
  import CategoryTabs from '@/components/search/CategoryTabs.vue'
  import ActivityFooter from '@/components/search/ActivityFooter.vue'
  import CopyrightFooter from '@/components/layout/CopyrightFooter.vue'
  import ChevronUpIcon from '@/components/icons/ChevronUpIcon.vue'
  import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
  import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue'
  import type { ConversationMessage } from '@/types/conversation'

  const route = useRoute()
  const router = useRouter()
  const searchQuery = ref('')
  const detailScrollContainer = ref<HTMLElement | null>(null)

  // Scroll state
  const showTopFade = ref(false)
  const canScrollUp = ref(false)
  const canScrollDown = ref(false)
  const hasScrollableContent = ref(false)

  // Mock data - in real app this would come from API based on route params
  const personProfile = ref({
    name: 'Johnson Smith',
    tags: [
      'Overview',
      'Personal Life',
      'Professional Life',
      'Finance',
      'Health'
    ],
    description:
      'Johnson Smith is an American businessman, inventor, and investor best known for co-founding the technology company ABC Inc. Johnson was also the founder of NeXT and chairman and majority shareholder of Pixar...'
  })

  const detailedPerson = ref({
    name: 'Johnson Smith',
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
  })

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

  const handleSearch = () => {
    // TODO: Implement search functionality
    // console.log('Search initiated:', searchQuery.value)
    // Implement search functionality
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

  // Generate conversation data for the detail page
  const conversationMessages = computed<ConversationMessage[]>(() => {
    return [
      {
        id: 'detail-response-1',
        sender: 'system',
        timestamp: new Date(),
        items: [
          {
            id: 'detail-summary',
            type: 'results-summary',
            resultCount: 1,
            template: 'Perfect match! Found detailed profile for Johnson Smith.'
          },
          {
            id: 'detail-text-1',
            type: 'text',
            content:
              "This appears to be the person you're looking for. Review the detailed information and use the actions below to explore related profiles.",
            emphasis: 'secondary'
          },
          {
            id: 'detail-action-1',
            type: 'action-button',
            text: 'Find similar profiles',
            variant: 'primary',
            onClick: () => handleSimilarProfiles()
          },
          {
            id: 'detail-action-2',
            type: 'action-button',
            text: 'Refine search criteria',
            variant: 'secondary',
            onClick: () => handleRefineSearch()
          }
        ]
      }
    ]
  })

  const handleSimilarProfiles = () => {
    // TODO: Implement similar profiles functionality
    // console.log('Find similar profiles clicked')
    // TODO: Implement similar profiles functionality
  }

  const handleRefineSearch = () => {
    // TODO: Implement search refinement
    // console.log('Refine search clicked')
    // TODO: Implement search refinement
  }

  const handleSpeechError = (_error: string) => {
    // TODO: Implement proper speech error handling UI
    // For now, errors are handled by the SearchBar component itself
    // In future, could show toast notifications or set error state
  }

  function handlePiClick() {
    // This function is kept for event binding compatibility but not used
    // The pi symbol now directly triggers lightbox from the footer component
  }

  onMounted(() => {
    // Load person data based on route params
    const personId = route.params.id as string
    if (personId) {
      // TODO: Load person data for production
      // In real app: loadPersonData(personId)
    }

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

  /* Scroll control buttons */
  .scroll-button {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background-color: #ff6b35; /* brand-orange */
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 20;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .scroll-button:hover {
    background-color: #e55a2e; /* darker orange on hover */
    transform: translateX(-50%) scale(1.05);
  }

  .scroll-button:active {
    transform: translateX(-50%) scale(0.95);
  }

  .scroll-button-top {
    top: 16px;
  }

  .scroll-button-bottom {
    bottom: 16px;
  }
</style>
