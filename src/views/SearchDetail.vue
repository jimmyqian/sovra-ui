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
          <SearchConversation />

          <!-- Search Input -->
          <div class="px-8 py-4 md:px-4">
            <SearchBar
              v-model="searchQuery"
              placeholder="Johnson, who is around 26 years old, works in a software company in California"
              @search="handleSearch"
              @file-upload="handleFileUpload"
            />
          </div>

          <!-- Spacer to push content up and search box immediately after content -->
          <div class="flex-1"></div>
        </div>

        <!-- Right Panel: Person Details -->
        <div class="flex-1 bg-bg-primary overflow-y-auto">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import AppHeader from '@/components/layout/AppHeader.vue'
  import AppSidebar from '@/components/navigation/AppSidebar.vue'
  import SearchBar from '@/components/common/SearchBar.vue'
  import SearchConversation from '@/components/search/SearchConversation.vue'
  import PersonProfile from '@/components/search/PersonProfile.vue'
  import DetailedResultCard from '@/components/search/DetailedResultCard.vue'
  import CategoryTabs from '@/components/search/CategoryTabs.vue'
  import ActivityFooter from '@/components/search/ActivityFooter.vue'

  const route = useRoute()
  const searchQuery = ref('')

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
    profileImage: '/api/placeholder/300/400',
    images: [
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
      '/api/placeholder/150/150'
    ],
    imageCount: 21,
    stats: {
      age: '26',
      netWorth: '$1,890 M USD (2022)'
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

  const handleSearch = () => {
    console.log('Search initiated:', searchQuery.value)
    // Implement search functionality
  }

  const handleFileUpload = (files: FileList) => {
    console.log('Files uploaded:', files)
    // Implement file upload functionality
  }

  const handleCategoryToggle = (categoryId: string, active: boolean) => {
    console.log('Category toggled:', categoryId, active)
    // Implement category toggle functionality
  }

  const handleShowReferences = () => {
    console.log('Show references clicked')
    // Implement show references functionality
  }

  const handleTagClick = (tag: string) => {
    console.log('Tag clicked:', tag)
    // Implement tag navigation functionality - could scroll to section or change view
  }

  onMounted(() => {
    // Load person data based on route params
    const personId = route.params.id as string
    if (personId) {
      console.log('Loading person data for ID:', personId)
      // In real app: loadPersonData(personId)
    }
  })
</script>
