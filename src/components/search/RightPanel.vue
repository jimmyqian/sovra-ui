<template>
  <!-- Right Panel: Results or Person Details -->
  <div class="flex-1 flex flex-col max-h-full overflow-hidden relative">
    <!-- Results View -->
    <div
      v-if="!selectedPerson"
      ref="resultsScrollContainer"
      class="flex-1 overflow-y-auto results-scroll"
      style="min-height: 0; max-height: 100%"
      @scroll="handleResultsScroll"
    >
      <RandomCardsGrid @card-click="handleCardClick" />
    </div>

    <!-- Person Details View -->
    <div v-else class="flex-1 bg-bg-primary overflow-y-auto">
      <div class="flex items-center gap-2 p-4 border-b border-border-light">
        <button
          class="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          @click="handleBackToResults"
        >
          <ChevronLeftIcon />
          <span>Back to Results</span>
        </button>
      </div>
      <main class="p-6 space-y-6">
        <!-- Person Profile Section -->
        <PersonProfile
          :person="{
            ...personProfile,
            name: selectedPerson.name,
            profileImage: getDetailedPersonData(selectedPerson).profileImage
          }"
          @tag-click="handleTagClick"
        />

        <!-- Detailed Information -->
        <DetailedResultCard :person="getDetailedPersonData(selectedPerson)" />

        <!-- Category Tabs -->
        <CategoryTabs
          :accounts="accounts"
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
    </div>

    <!-- Fade-out gradient overlay at top - shows when scrolled -->
    <div
      v-if="!selectedPerson"
      class="fade-overlay-top"
      :class="[{ visible: showTopFade }]"
    ></div>
    <!-- Fade-out gradient overlay at bottom - fixed to viewport -->
    <div v-if="!selectedPerson" class="fade-overlay"></div>

    <!-- Page Footer -->
    <CopyrightFooter @pi-click="handlePiClick" />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import RandomCardsGrid from './RandomCardsGrid.vue'
  import PersonProfile from './PersonProfile.vue'
  import DetailedResultCard from './DetailedResultCard.vue'
  import CategoryTabs from './CategoryTabs.vue'
  import ActivityFooter from './ActivityFooter.vue'
  import CopyrightFooter from '@/components/layout/CopyrightFooter.vue'
  import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue'
  import type { SearchResult } from '@/types/search'

  interface Props {
    results: SearchResult[]
    isLoading: boolean
    error: string | null
    selectedPerson: SearchResult | null
  }

  interface Emits {
    (_e: 'personSelected', _person: SearchResult): void
    (_e: 'backToResults'): void
    (_e: 'piClick'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const resultsScrollContainer = ref<HTMLElement | null>(null)
  const showTopFade = ref(false)

  // Mock data for person details - in real app this would come from API
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

  const accounts = ref([
    { type: 'instagram', url: 'https://instagram.com/johnsonsmith' },
    { type: 'whatsapp', url: 'https://wa.me/1234567890' },
    { type: 'facebook', url: 'https://facebook.com/johnsonsmith' },
    { type: 'twitter', url: 'https://twitter.com/johnsonsmith' },
    { type: 'linkedin', url: 'https://linkedin.com/in/johnsonsmith' }
  ])

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

  // Generate detailed person data from search result
  const getDetailedPersonData = (person: SearchResult) => {
    return {
      name: person.name,
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
        age: person.age.toString(),
        netWorth: '$1.890 M USD (2022)'
      },
      personal: {
        birthDate: '10 Aug 2000',
        birthPlace: `${person.location}, USA`,
        spouse:
          person.maritalStatus === 'Married'
            ? 'Justine m. 2023-2025'
            : 'Single',
        currentLocation: person.location,
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
    }
  }

  const handleBackToResults = () => {
    emit('backToResults')
  }

  const handleResultsScroll = () => {
    if (resultsScrollContainer.value) {
      const container = resultsScrollContainer.value
      const scrollTop = container.scrollTop

      // Show top fade when scrolled more than 20px from top
      showTopFade.value = scrollTop > 20
    }
  }

  const handleTagClick = (_tag: string) => {
    // TODO: Implement tag navigation functionality
    // console.log('Tag clicked:', tag)
    // Implement tag navigation functionality - could scroll to section or change view
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

  const handlePiClick = () => {
    emit('piClick')
  }

  /**
   * Handle card click from RandomCardsGrid component
   * @param card - The clicked card object
   */
  const handleCardClick = (_card: {
    id: number
    title: string
    description: string
    height: number
    colorClass: string
  }) => {
    // TODO: Implement card click functionality
    // For now, we can log the clicked card or emit an event
    // console.log('Card clicked:', _card)
  }

  // Watch for changes in results to update scroll state
  watch(
    () => props.results.length,
    () => {
      // Use a small delay to avoid layout thrashing during rapid updates
      setTimeout(() => {
        handleResultsScroll()
      }, 10)
    },
    { immediate: true }
  )
</script>

<style scoped>
  .fade-overlay {
    position: absolute;
    bottom: 128px; /* Above Load More button and footer */
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

  /* Hide scrollbars on results panel */
  .results-scroll {
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
