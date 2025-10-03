<template>
  <SearchLayout
    search-placeholder="Tell me more about who you're looking for"
    @search="handleSearch"
    @file-upload="handleFileUpload"
    @speech-error="handleSpeechError"
  >
    <!-- Right Panel: Person Details -->
    <div class="flex-1 flex flex-col max-h-full overflow-hidden relative">
      <div
        ref="detailScrollContainer"
        class="flex-1 overflow-y-auto max-h-full detail-scroll"
        @scroll="handleDetailScroll"
      >
        <!-- Back Navigation -->
        <div class="flex items-center gap-2 p-6 pb-0">
          <BackButton />
        </div>

        <main class="p-6 space-y-6">
          <!-- Show Dashboard for Robert Schmidt -->
          <div v-if="isRobertSchmidt && robertProfile">
            <!-- Profile Section - AT TOP -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <!-- Main Profile Card -->
              <div class="lg:col-span-2">
                <ProfileCard
                  :name="robertProfile.name"
                  :title="robertProfile.title"
                  :profile-image="robertProfile.profileImage"
                  :membership-level="robertProfile.membershipLevel"
                  :age="robertProfile.age"
                  :location="robertProfile.location"
                  :marital-status="robertProfile.maritalStatus"
                  :net-worth="robertProfile.netWorth"
                  :occupation="robertProfile.occupation"
                  :education="robertProfile.education"
                />
              </div>

              <!-- Quick Stats -->
              <div class="space-y-4">
                <div
                  class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-4 border-2 border-green-300"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <CurrencyDollarIcon class="w-7 h-7 text-white" />
                    </div>
                    <div class="flex-1">
                      <div class="text-sm text-green-700">Net Worth</div>
                      <div class="text-2xl font-bold text-green-900">
                        {{ robertProfile.netWorth }}
                      </div>
                      <div class="text-xs text-green-600">Updated 2025</div>
                    </div>
                  </div>
                </div>
                <div
                  class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-4 border-2 border-blue-300"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <GlobeAltIcon class="w-7 h-7 text-white" />
                    </div>
                    <div class="flex-1">
                      <div class="text-sm text-blue-700">Network Size</div>
                      <div class="text-2xl font-bold text-blue-900">2,400+</div>
                      <div class="text-xs text-blue-600">
                        High-value connections
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Risk Scores Infographic -->
            <div
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
            >
              <div
                class="bg-red-50 border-2 border-red-400 rounded-lg p-4 text-center hover:shadow-lg transition-all cursor-pointer"
                :class="{
                  'ring-4 ring-red-300': selectedRiskDetails === 'reputation'
                }"
                @click="toggleRiskDetails('reputation')"
              >
                <div
                  class="w-10 h-10 mx-auto mb-2 bg-red-600 rounded-full flex items-center justify-center"
                >
                  <ExclamationTriangleIcon class="w-6 h-6 text-white" />
                </div>
                <div class="text-xs text-red-600 font-medium mb-1">
                  Reputation Risk
                </div>
                <div class="text-2xl font-bold text-red-700">HIGH</div>
              </div>
              <div
                class="bg-red-50 border-2 border-red-400 rounded-lg p-4 text-center hover:shadow-lg transition-all cursor-pointer"
                :class="{
                  'ring-4 ring-red-300': selectedRiskDetails === 'interpersonal'
                }"
                @click="toggleRiskDetails('interpersonal')"
              >
                <div
                  class="w-10 h-10 mx-auto mb-2 bg-red-600 rounded-full flex items-center justify-center"
                >
                  <UserGroupIcon class="w-6 h-6 text-white" />
                </div>
                <div class="text-xs text-red-600 font-medium mb-1">
                  Interpersonal Risk
                </div>
                <div class="text-2xl font-bold text-red-700">HIGH</div>
              </div>
              <div
                class="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 text-center hover:shadow-lg transition-all cursor-pointer"
                :class="{
                  'ring-4 ring-orange-200': selectedRiskDetails === 'cyber'
                }"
                @click="toggleRiskDetails('cyber')"
              >
                <div
                  class="w-10 h-10 mx-auto mb-2 bg-orange-500 rounded-full flex items-center justify-center"
                >
                  <LockClosedIcon class="w-6 h-6 text-white" />
                </div>
                <div class="text-xs text-orange-600 font-medium mb-1">
                  Cyber Security Risk
                </div>
                <div class="text-2xl font-bold text-orange-700">MED</div>
              </div>
              <div
                class="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 text-center hover:shadow-lg transition-all cursor-pointer"
                :class="{
                  'ring-4 ring-orange-200': selectedRiskDetails === 'corporate'
                }"
                @click="toggleRiskDetails('corporate')"
              >
                <div
                  class="w-10 h-10 mx-auto mb-2 bg-orange-500 rounded-full flex items-center justify-center"
                >
                  <BuildingOfficeIcon class="w-6 h-6 text-white" />
                </div>
                <div class="text-xs text-orange-600 font-medium mb-1">
                  Corporate Risk
                </div>
                <div class="text-2xl font-bold text-orange-700">MED</div>
              </div>
              <div
                class="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 text-center hover:shadow-lg transition-all cursor-pointer"
                :class="{
                  'ring-4 ring-orange-200': selectedRiskDetails === 'family'
                }"
                @click="toggleRiskDetails('family')"
              >
                <div
                  class="w-10 h-10 mx-auto mb-2 bg-orange-500 rounded-full flex items-center justify-center"
                >
                  <HomeIcon class="w-6 h-6 text-white" />
                </div>
                <div class="text-xs text-orange-600 font-medium mb-1">
                  Family Risk
                </div>
                <div class="text-2xl font-bold text-orange-700">MED</div>
              </div>
              <div
                class="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center hover:shadow-lg transition-all cursor-pointer"
                :class="{
                  'ring-4 ring-green-200': selectedRiskDetails === 'physical'
                }"
                @click="toggleRiskDetails('physical')"
              >
                <div
                  class="w-10 h-10 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <ShieldCheckIcon class="w-6 h-6 text-white" />
                </div>
                <div class="text-xs text-green-600 font-medium mb-1">
                  Physical Risk
                </div>
                <div class="text-2xl font-bold text-green-700">LOW</div>
              </div>
            </div>

            <!-- Risk Details Panel -->
            <div
              v-if="selectedRiskDetails"
              class="mb-6 p-6 bg-white rounded-lg shadow-md border-2 border-gray-300"
            >
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-semibold text-gray-900">
                  Risk Details
                </h3>
                <button
                  class="text-gray-500 hover:text-gray-700 text-xl font-bold"
                  @click="selectedRiskDetails = null"
                >
                  ×
                </button>
              </div>
              <div
                class="prose prose-sm max-w-none"
                v-html="riskDetails[selectedRiskDetails]"
              ></div>
            </div>

            <!-- Network Graph -->
            <div class="mb-6">
              <NetworkGraphCard
                title="Network"
                subtitle="Key relationships and connections"
                :nodes="networkNodes"
                :links="networkLinks"
                :width="800"
                :height="400"
              />
            </div>

            <!-- Life Events Timeline -->
            <div class="mb-6">
              <TimelineCard
                title="Life Events Timeline"
                subtitle="Major milestones in Robert's personal and professional journey"
                :events="robertLifeEvents"
                :width="1200"
                :height="400"
              />
            </div>

            <!-- US Locations Map -->
            <div class="mb-6">
              <USMapCard
                title="Geographic Footprint"
                subtitle="Places Robert has lived, worked, and invested"
                :locations="robertLocations"
                :width="800"
                :height="500"
              />
            </div>

            <!-- Risk Assessment Cards - Detailed -->
            <div class="space-y-4">
              <RiskCard
                v-for="card in dashboardCards"
                :key="card.id"
                :title="card.title"
                :subtitle="card.subtitle"
                :risk-level="card.riskLevel"
                :risk-items="card.riskItems"
                :content="card.content"
                :details="card.details"
                :actions="card.actions"
              />
            </div>
          </div>

          <!-- Default Person Profile View -->
          <div v-else>
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
          </div>
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
  import { getPersonById } from '@/utils/conversationScripts'
  import {
    getRobertDashboardCards,
    getRobertProfile,
    getRobertLifeEvents,
    getRobertLocations
  } from '@/utils/robertDashboardData'
  import SearchLayout from '@/components/layouts/SearchLayout.vue'
  import PersonProfile from '@/components/search/PersonProfile.vue'
  import DetailedResultCard from '@/components/search/DetailedResultCard.vue'
  import CategoryTabs from '@/components/search/CategoryTabs.vue'
  import ActivityFooter from '@/components/search/ActivityFooter.vue'
  import CopyrightFooter from '@/components/layout/CopyrightFooter.vue'
  import ChevronUpIcon from '@/components/icons/ChevronUpIcon.vue'
  import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
  import BackButton from '@/components/common/BackButton.vue'
  import RiskCard from '@/components/dashboard/RiskCard.vue'
  import ProfileCard from '@/components/dashboard/ProfileCard.vue'
  import NetworkGraphCard from '@/components/dashboard/NetworkGraphCard.vue'
  import TimelineCard from '@/components/dashboard/TimelineCard.vue'
  import USMapCard from '@/components/dashboard/USMapCard.vue'
  import {
    ExclamationTriangleIcon,
    UserGroupIcon,
    LockClosedIcon,
    BuildingOfficeIcon,
    HomeIcon,
    ShieldCheckIcon,
    CurrencyDollarIcon,
    GlobeAltIcon
  } from '@heroicons/vue/24/solid'

  const route = useRoute()
  const router = useRouter()
  const conversationStore = useConversationStore()
  const searchStore = useSearchStore()
  const detailScrollContainer = ref<HTMLElement | null>(null)
  const selectedRiskDetails = ref<string | null>(null)

  // Risk detailed descriptions
  const riskDetails: Record<string, string> = {
    reputation: `<div class="space-y-4">
      <h4 class="font-semibold text-gray-900">1. Divorce and Remarriage</h4>
      <p class="text-sm">Your contentious divorce is cited across seven digital publications, three Reddit threads, and a long-form blog post. A persistent "double life" narrative is being reinforced by AI summarization bots scraping metadata.</p>

      <h4 class="font-semibold text-gray-900">2. Current Marriage, Affairs Allegation, and Spouse Reputation</h4>
      <p class="text-sm">Your spouse's philanthropic presence links her name with yours across major databases—her credibility becomes a proxy for your own. However, this credibility may be undermined by alleged extramarital affairs appear in social commentary, AI-generated dossiers, and social listening feeds. She also provides funds to a non-profit that may have links with nefarious personalities.</p>

      <h4 class="font-semibold text-gray-900">3. SEC & Network Affiliations</h4>
      <p class="text-sm">Legacy SEC investigations remain indexed and interlinked via knowledge graphs. A college roommate's pyramid scheme case is currently rising in visibility, with your name attached by association. A new associate was indicted last week—this is surfacing through online network analysis.</p>

      <h4 class="font-semibold text-gray-900">4. Leadership Turnover & Culture</h4>
      <p class="text-sm">Glassdoor and insider commentary describe your leadership as "charismatic but draining," with high turnover and intense expectations.</p>
    </div>`,
    interpersonal: `<div class="space-y-4">
      <h4 class="font-semibold text-gray-900">Interpersonal Risk: High Risk</h4>
      <p class="text-sm">You have a highly controversial and disputed divorce that was cited several times in online sources. Additionally, you are remarried, but many of these same sources have noted that you are involved in extramarital affairs. Expectations for family members often match those of employees and may have created much of a similar cycle of turnover and burnout. At times others may perceive you as entitled to relationships that meet your needs over serving others.</p>
      <p class="text-sm font-semibold mt-4">Would you like me to develop out a plan of how to change this perception? Should I do this for work as well as home? I can also have a relationship with some organizations that will help you to clean up your profile online. Would you like me to help you get started?</p>
    </div>`,
    cyber: `<div class="space-y-3">
      <p class="font-semibold">Critical Exposures Found:</p>
      <ul class="list-disc pl-5 space-y-1 text-sm">
        <li>Two personal logins reused across travel/event platforms</li>
        <li>Metadata exposing your children's educational affiliations</li>
        <li>Legal documents from prior divorce with partial financials</li>
      </ul>
      <p class="font-semibold mt-4">Recommended Actions:</p>
      <ul class="list-disc pl-5 space-y-1 text-sm">
        <li>Reset and compartmentalize credentials</li>
        <li>Deploy monitoring to detect misuse</li>
        <li>Initiate family monitoring for breach exposure</li>
        <li>Transition core communications to encrypted platforms with rotating authentication</li>
      </ul>
    </div>`,
    corporate: `<div class="space-y-3">
      <h4 class="font-semibold text-gray-900">Corporate Integrity Risk</h4>
      <p class="text-sm">One former associate (SEC watchlist) flagged in corporate link analysis last week. Multiple online narratives link past SEC investigations to associations with indicted contacts.</p>
    </div>`,
    family: `<div class="space-y-3">
      <h4 class="font-semibold text-gray-900">Family Risk: Medium Risk</h4>
      <p class="text-sm">The increase in your family complexity with the divorce and the perception of extra marital relationships can impact the cohesion of your family structure and well being. Additionally, having high wealth may make you a target for familial exploitation. It will be important to monitor family contacts for relationship.</p>
      <p class="text-sm">Negative comments about you by your ex-wife were recently posted online.</p>
    </div>`,
    physical: `<div class="space-y-3">
      <h4 class="font-semibold text-gray-900">Physical Security Risk: Low Risk</h4>
      <p class="text-sm">While your physical security risk is minimal, I have mapped your pattern of life and found multiple points of tracking data almost continually mapping your movements. Historical patterns of movement are typically predictable and may alert nefarious actors to your current and future locations.</p>
      <p class="text-sm font-semibold mt-4">I have constructed a card to the right that shows your most traveled locations.</p>
      <p class="text-sm text-gray-600 italic">Thank you SOVRA, Could you tell me what is tracking my movements?</p>
      <p class="text-sm">Absolutely. I have just inserted a card identifying the tracking apps and wearables that are documenting your position. As you will see, your phone and oura ring seem to provide the most specific data. Would you like me to help you to limit sharing on these devices?</p>
    </div>`
  }

  const toggleRiskDetails = (riskType: string) => {
    selectedRiskDetails.value =
      selectedRiskDetails.value === riskType ? null : riskType
  }

  // Detail panel scroll state
  const showTopFade = ref(false)
  const canScrollUp = ref(false)
  const canScrollDown = ref(false)
  const hasScrollableContent = ref(false)

  // Get person data from route params and search store
  // Default to Robert Schmidt 1 if no ID is provided
  const ROBERT_SCHMIDT_1_ID = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b'
  const personId = computed(() => {
    const id = route.params.id as string | undefined
    return id && id.trim() !== '' ? id : ROBERT_SCHMIDT_1_ID
  })
  const selectedPerson = computed(() => {
    if (personId.value) {
      // First try to find in search results
      const fromSearch = searchStore.findPersonById(personId.value)
      if (fromSearch) {
        return fromSearch
      }
      // Fallback to person definitions (for direct navigation)
      return getPersonById(personId.value)
    }
    return null
  })

  // Use the person's actual name or fallback to "Unknown Person"
  const personName = computed(
    () => selectedPerson.value?.name ?? 'Unknown Person'
  )

  // Check if this is Robert Schmidt's dashboard
  const isRobertSchmidt = computed(() => personId.value === ROBERT_SCHMIDT_1_ID)

  // Get dashboard cards for Robert
  const dashboardCards = computed(() =>
    isRobertSchmidt.value ? getRobertDashboardCards() : []
  )

  // Get Robert's profile
  const robertProfile = computed(() =>
    isRobertSchmidt.value ? getRobertProfile() : null
  )

  // Get Robert's life events
  const robertLifeEvents = computed(() =>
    isRobertSchmidt.value ? getRobertLifeEvents() : []
  )

  // Get Robert's locations
  const robertLocations = computed(() =>
    isRobertSchmidt.value ? getRobertLocations() : []
  )

  // Network graph data for Robert Schmidt
  const networkNodes = computed(() => [
    {
      id: 'robert',
      name: 'Robert Schmidt',
      type: 'primary' as const,
      image:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'daughter',
      name: 'Sarah Schmidt',
      type: 'family' as const,
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'preston',
      name: 'Preston Cole Whitaker III',
      type: 'associate' as const,
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'son1',
      name: 'Michael Schmidt',
      type: 'family' as const,
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'son2',
      name: 'James Schmidt',
      type: 'family' as const,
      image:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'spouse',
      name: 'Christine Schmidt',
      type: 'family' as const,
      image:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'partner1',
      name: 'John Davis',
      type: 'associate' as const,
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'partner2',
      name: 'Maria Chen',
      type: 'associate' as const,
      image:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'sec_contact',
      name: 'David Wilson',
      type: 'associate' as const,
      image:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'exwife',
      name: 'Jennifer Schmidt',
      type: 'family' as const,
      image:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'lawyer',
      name: 'Thomas Brooks',
      type: 'associate' as const,
      image:
        'https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'board1',
      name: 'Richard Anderson',
      type: 'associate' as const,
      image:
        'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=faces'
    }
  ])

  const networkLinks = computed(() => [
    { source: 'robert', target: 'daughter', relationship: 'father-daughter' },
    { source: 'robert', target: 'son1', relationship: 'father-son' },
    { source: 'robert', target: 'son2', relationship: 'father-son' },
    { source: 'robert', target: 'spouse', relationship: 'married' },
    { source: 'daughter', target: 'preston', relationship: 'dating' },
    { source: 'robert', target: 'partner1', relationship: 'business-partner' },
    { source: 'robert', target: 'partner2', relationship: 'business-partner' },
    {
      source: 'robert',
      target: 'sec_contact',
      relationship: 'sec-investigation'
    },
    { source: 'robert', target: 'exwife', relationship: 'ex-spouse' },
    { source: 'robert', target: 'lawyer', relationship: 'legal-counsel' },
    { source: 'robert', target: 'board1', relationship: 'board-member' },
    { source: 'partner1', target: 'partner2', relationship: 'colleagues' }
  ])

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

  const handleSearch = async (_query: string) => {
    // Search handling is now done by ConversationPanel component
    // This is just for any additional logic specific to SearchDetail
  }

  const handleFileUpload = (_files: File[]) => {
    // TODO: Implement file upload functionality
    // console.log('Files uploaded:', files)
    // Implement file upload functionality
  }

  const handleCategoryToggle = (categoryId: string, _active: boolean) => {
    // Handle network view navigation
    if (categoryId === 'network') {
      router.push('/network')
    }
    // TODO: Implement other category toggle functionality
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

    // Load person data based on route params (or default)
    if (personId.value) {
      // TODO: Load person data for production
      // In real app: loadPersonData(personId.value)
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
