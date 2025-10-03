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
              class="mb-6 p-6 rounded-lg shadow-xl border-4 animate-pulse-slow"
              :class="{
                'bg-red-50 border-red-500':
                  selectedRiskDetails === 'reputation' ||
                  selectedRiskDetails === 'interpersonal',
                'bg-orange-50 border-orange-400':
                  selectedRiskDetails === 'cyber' ||
                  selectedRiskDetails === 'corporate' ||
                  selectedRiskDetails === 'family',
                'bg-green-50 border-green-400':
                  selectedRiskDetails === 'physical'
              }"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-3">
                  <component
                    :is="
                      selectedRiskDetails === 'reputation' ||
                      selectedRiskDetails === 'interpersonal'
                        ? ExclamationTriangleIcon
                        : selectedRiskDetails === 'physical'
                          ? ShieldCheckIcon
                          : ExclamationTriangleIcon
                    "
                    class="w-8 h-8"
                    :class="{
                      'text-red-600 animate-bounce':
                        selectedRiskDetails === 'reputation' ||
                        selectedRiskDetails === 'interpersonal',
                      'text-orange-600':
                        selectedRiskDetails === 'cyber' ||
                        selectedRiskDetails === 'corporate' ||
                        selectedRiskDetails === 'family',
                      'text-green-600': selectedRiskDetails === 'physical'
                    }"
                  />
                  <h3
                    class="text-xl font-bold"
                    :class="{
                      'text-red-900':
                        selectedRiskDetails === 'reputation' ||
                        selectedRiskDetails === 'interpersonal',
                      'text-orange-900':
                        selectedRiskDetails === 'cyber' ||
                        selectedRiskDetails === 'corporate' ||
                        selectedRiskDetails === 'family',
                      'text-green-900': selectedRiskDetails === 'physical'
                    }"
                  >
                    Risk Details
                  </h3>
                </div>
                <button
                  class="text-gray-600 hover:text-gray-900 text-2xl font-bold"
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

            <!-- Personality and Tracking Sources -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <PersonalityProfileCard
                title="Personality Profile"
                subtitle="Leadership characteristics and behavioral patterns"
                :summary="robertPersonality.summary"
                :traits="robertPersonality.traits"
              />
              <TrackingSourcesCard
                title="Top Tracking Sources"
                subtitle="Online data sources and exposure levels"
                :sources="robertTrackingSources"
              />
            </div>

            <!-- Visualization Cards Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <!-- Network Graph -->
              <div>
                <NetworkGraphCard
                  title="Network"
                  subtitle="Key relationships and connections"
                  :nodes="networkNodes"
                  :links="networkLinks"
                  :width="500"
                  :height="450"
                  @node-click="handleNodeClick"
                />
              </div>

              <!-- Life Events Timeline -->
              <div>
                <TimelineCard
                  title="Life Events Timeline"
                  subtitle="Major milestones in Robert's personal and professional journey"
                  :events="robertLifeEvents"
                  :width="600"
                  :height="400"
                />
              </div>

              <!-- US Locations Map -->
              <div class="lg:col-span-2">
                <USMapCard
                  title="Geographic Footprint"
                  subtitle="Places Robert has lived, worked, and invested"
                  :locations="robertLocations"
                  :width="1000"
                  :height="500"
                />
              </div>
            </div>

            <!-- Summary and Recommendations -->
            <div class="mb-6">
              <SummaryRecommendationsCard
                title="Summary & Recommendations"
                subtitle="Comprehensive risk assessment and action plan"
                :summary="robertSummary.summary"
                :key-findings="robertSummary.keyFindings"
                :recommendations="robertSummary.recommendations"
                :next-steps="robertSummary.nextSteps"
              />
            </div>
          </div>

          <!-- Preston Whitaker Dashboard -->
          <div v-else-if="isPrestonWhitaker && prestonProfile">
            <!-- Profile Card -->
            <ProfileCard
              :name="prestonProfile.name"
              :profile-image="prestonProfile.profileImage"
              :subtitle="`${prestonProfile.occupation} • ${prestonProfile.education}`"
              :age="prestonProfile.age.toString()"
              :location="prestonProfile.location"
              :status="prestonProfile.status"
              :net-worth="prestonProfile.financialInfo.trust"
              :occupation="prestonProfile.occupation"
              :education="prestonProfile.education"
              :stats="[
                {
                  label: 'Trust Fund',
                  value: prestonProfile.financialInfo.trust
                },
                {
                  label: 'Monthly Spending',
                  value: prestonProfile.financialInfo.spending
                },
                {
                  label: 'Gambling Debts',
                  value: prestonProfile.financialInfo.debts
                }
              ]"
            />

            <!-- Risk Cards Grid -->
            <div
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6"
            >
              <div
                class="bg-red-50 border-2 border-red-400 rounded-lg p-4 text-center hover:shadow-lg transition-all cursor-pointer"
                :class="{
                  'ring-4 ring-red-300': selectedRiskDetails === 'gambling'
                }"
                @click="toggleRiskDetails('gambling')"
              >
                <component
                  :is="CurrencyDollarIcon"
                  class="w-10 h-10 mx-auto mb-2 text-red-600"
                />
                <div class="text-sm font-semibold text-red-900">
                  Gambling Addiction
                </div>
                <div class="text-2xl font-bold text-red-700">CRITICAL</div>
              </div>
              <div
                class="bg-red-50 border-2 border-red-400 rounded-lg p-4 text-center hover:shadow-lg transition-all cursor-pointer"
                :class="{
                  'ring-4 ring-red-300': selectedRiskDetails === 'deception'
                }"
                @click="toggleRiskDetails('deception')"
              >
                <component
                  :is="EyeSlashIcon"
                  class="w-10 h-10 mx-auto mb-2 text-red-600"
                />
                <div class="text-sm font-semibold text-red-900">
                  Deceptive Lifestyle
                </div>
                <div class="text-2xl font-bold text-red-700">CRITICAL</div>
              </div>
              <div
                class="bg-red-50 border-2 border-red-400 rounded-lg p-4 text-center hover:shadow-lg transition-all cursor-pointer"
                :class="{
                  'ring-4 ring-red-300': selectedRiskDetails === 'narcissism'
                }"
                @click="toggleRiskDetails('narcissism')"
              >
                <component
                  :is="SparklesIcon"
                  class="w-10 h-10 mx-auto mb-2 text-red-600"
                />
                <div class="text-sm font-semibold text-red-900">
                  Dark Triad Traits
                </div>
                <div class="text-2xl font-bold text-red-700">HIGH</div>
              </div>
              <div
                class="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 text-center hover:shadow-lg transition-all cursor-pointer"
                :class="{
                  'ring-4 ring-orange-200':
                    selectedRiskDetails === 'family_exposure'
                }"
                @click="toggleRiskDetails('family_exposure')"
              >
                <component
                  :is="HomeIcon"
                  class="w-10 h-10 mx-auto mb-2 text-orange-600"
                />
                <div class="text-sm font-semibold text-orange-900">
                  Family Exposure
                </div>
                <div class="text-2xl font-bold text-orange-700">HIGH</div>
              </div>
              <div
                class="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 text-center hover:shadow-lg transition-all cursor-pointer"
                :class="{
                  'ring-4 ring-orange-200': selectedRiskDetails === 'volatility'
                }"
                @click="toggleRiskDetails('volatility')"
              >
                <component
                  :is="BoltIcon"
                  class="w-10 h-10 mx-auto mb-2 text-orange-600"
                />
                <div class="text-sm font-semibold text-orange-900">
                  Behavioral Volatility
                </div>
                <div class="text-2xl font-bold text-orange-700">HIGH</div>
              </div>
            </div>

            <!-- Risk Details Panel (shown when a risk card is clicked) -->
            <div
              v-if="selectedRiskDetails"
              class="mb-6 p-6 rounded-lg shadow-xl border-4 animate-pulse-slow"
              :class="{
                'bg-red-50 border-red-500': [
                  'gambling',
                  'deception',
                  'narcissism'
                ].includes(selectedRiskDetails),
                'bg-orange-50 border-orange-400': [
                  'family_exposure',
                  'volatility'
                ].includes(selectedRiskDetails)
              }"
            >
              <div class="flex items-center justify-between mb-4">
                <component
                  :is="ExclamationTriangleIcon"
                  class="w-8 h-8"
                  :class="{
                    'text-red-600 animate-bounce': [
                      'gambling',
                      'deception',
                      'narcissism'
                    ].includes(selectedRiskDetails),
                    'text-orange-600': [
                      'family_exposure',
                      'volatility'
                    ].includes(selectedRiskDetails)
                  }"
                />
                <button
                  class="text-gray-500 hover:text-gray-700"
                  @click="selectedRiskDetails = null"
                >
                  ✕
                </button>
              </div>
              <div
                class="prose prose-sm max-w-none"
                v-html="prestonRiskDetails[selectedRiskDetails]"
              ></div>
            </div>

            <!-- Personality and Tracking Sources -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <PersonalityProfileCard
                title="Dark Triad Profile"
                subtitle="Narcissism, manipulation, and impulsivity indicators"
                :summary="prestonPersonality.summary"
                :traits="prestonPersonality.traits"
              />
              <TrackingSourcesCard
                title="Critical Tracking Sources"
                subtitle="High-risk behavioral and financial data points"
                :sources="prestonTrackingSources"
              />
            </div>

            <!-- Visualization Cards Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <!-- Network Graph -->
              <div>
                <NetworkGraphCard
                  title="Network & Connections"
                  subtitle="Gambling associates and family ties"
                  :nodes="prestonNetwork.nodes"
                  :links="prestonNetwork.links"
                  :width="500"
                  :height="450"
                />
              </div>

              <!-- Life Events Timeline -->
              <div>
                <TimelineCard
                  title="Life Events & Red Flags"
                  subtitle="Pattern of escalating risk behavior"
                  :events="prestonLifeEvents"
                  :width="600"
                  :height="400"
                />
              </div>

              <!-- Gambling Transactions -->
              <div>
                <GamblingTransactionsCard
                  title="Gambling Transaction History"
                  subtitle="Net profit/loss from sports betting (10 months)"
                  :transactions="prestonGamblingTransactions"
                  :width="600"
                  :height="400"
                />
              </div>

              <!-- Social Media Sentiment -->
              <div>
                <SentimentAnalysisCard
                  title="Social Media Behavioral Analysis"
                  subtitle="Narcissistic, volatile, and positive post trends"
                  :data="prestonSocialMediaSentiment"
                  :width="600"
                  :height="400"
                />
              </div>

              <!-- US Locations Map -->
              <div class="lg:col-span-2">
                <USMapCard
                  title="Geographic Risk Pattern"
                  subtitle="Austin-Vegas travel: Hidden gambling trips"
                  :locations="prestonLocations"
                  :width="1000"
                  :height="500"
                />
              </div>
            </div>

            <!-- Summary and Recommendations -->
            <div class="mb-6">
              <SummaryRecommendationsCard
                title="Critical Family Risk Assessment"
                subtitle="Immediate intervention required to protect Schmidt family"
                :summary="prestonSummary.summary"
                :key-findings="prestonSummary.keyFindings"
                :recommendations="prestonSummary.recommendations"
                :next-steps="prestonSummary.nextSteps"
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
    getRobertProfile,
    getRobertLifeEvents,
    getRobertLocations,
    getRobertPersonalityProfile,
    getRobertTrackingSources,
    getRobertSummaryRecommendations
  } from '@/utils/robertDashboardData'
  import {
    getPrestonProfile,
    getPrestonLifeEvents,
    getPrestonLocations,
    getPrestonPersonalityProfile,
    getPrestonTrackingSources,
    getPrestonSummaryRecommendations,
    getPrestonNetwork,
    getPrestonGamblingTransactions,
    getPrestonSocialMediaSentiment
  } from '@/utils/prestonDashboardData'
  import SearchLayout from '@/components/layouts/SearchLayout.vue'
  import PersonProfile from '@/components/search/PersonProfile.vue'
  import DetailedResultCard from '@/components/search/DetailedResultCard.vue'
  import CategoryTabs from '@/components/search/CategoryTabs.vue'
  import ActivityFooter from '@/components/search/ActivityFooter.vue'
  import CopyrightFooter from '@/components/layout/CopyrightFooter.vue'
  import ChevronUpIcon from '@/components/icons/ChevronUpIcon.vue'
  import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
  import BackButton from '@/components/common/BackButton.vue'
  import ProfileCard from '@/components/dashboard/ProfileCard.vue'
  import NetworkGraphCard from '@/components/dashboard/NetworkGraphCard.vue'
  import TimelineCard from '@/components/dashboard/TimelineCard.vue'
  import USMapCard from '@/components/dashboard/USMapCard.vue'
  import PersonalityProfileCard from '@/components/dashboard/PersonalityProfileCard.vue'
  import TrackingSourcesCard from '@/components/dashboard/TrackingSourcesCard.vue'
  import SummaryRecommendationsCard from '@/components/dashboard/SummaryRecommendationsCard.vue'
  import GamblingTransactionsCard from '@/components/dashboard/GamblingTransactionsCard.vue'
  import SentimentAnalysisCard from '@/components/dashboard/SentimentAnalysisCard.vue'
  import {
    ExclamationTriangleIcon,
    UserGroupIcon,
    LockClosedIcon,
    BuildingOfficeIcon,
    HomeIcon,
    ShieldCheckIcon,
    CurrencyDollarIcon,
    GlobeAltIcon,
    BoltIcon,
    LightBulbIcon,
    HandThumbUpIcon,
    NewspaperIcon,
    BriefcaseIcon,
    AtSymbolIcon,
    UsersIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    ShieldExclamationIcon,
    HeartIcon,
    FireIcon,
    AcademicCapIcon,
    EyeSlashIcon,
    CameraIcon,
    MapPinIcon,
    ChartBarIcon,
    BanknotesIcon,
    BuildingLibraryIcon,
    SparklesIcon
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
      <h4 class="font-semibold text-gray-900">Reputational Risk Analysis - High Risk</h4>

      <div class="bg-gray-50 p-4 rounded-lg">
        <h5 class="font-semibold text-gray-800 mb-2">1. Divorce and Remarriage</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>Your contentious divorce is cited across seven digital publications, three Reddit threads, and a long-form blog post.</li>
          <li>A persistent "double life" narrative is being reinforced by AI summarization bots scraping metadata.</li>
        </ul>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg">
        <h5 class="font-semibold text-gray-800 mb-2">2. Current Marriage, Affairs Allegation, and Spouse Reputation</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>Your spouse's philanthropic presence links her name with yours across major databases—her credibility becomes a proxy for your own.</li>
          <li>Alleged extramarital affairs appear in social commentary, AI-generated dossiers, and social listening feeds.</li>
          <li>She also provides funds to a non-profit that may have links with nefarious personalities.</li>
        </ul>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg">
        <h5 class="font-semibold text-gray-800 mb-2">3. SEC & Network Affiliations</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>Legacy SEC investigations remain indexed and interlinked via knowledge graphs.</li>
          <li>A college roommate's pyramid scheme case is currently rising in visibility, with your name attached by association.</li>
          <li>A new associate was indicted last week—this is surfacing through online network analysis.</li>
        </ul>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg">
        <h5 class="font-semibold text-gray-800 mb-2">4. Leadership Turnover & Culture</h5>
        <p class="text-sm text-gray-700">Glassdoor and insider commentary describe your leadership as "charismatic but draining," with high turnover and intense expectations.</p>
      </div>

      <div class="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h5 class="font-semibold text-blue-900 mb-2">Reputation Restoration Plan</h5>
        <p class="text-sm text-blue-800 mb-2">Your SOVRA account will automatically link and provide updates on progress.</p>
        <p class="text-sm text-blue-800 mb-2">Executing comprehensive reputation management strategy including:</p>
        <ul class="list-disc pl-5 space-y-1 text-sm text-blue-700">
          <li>Content removal and obfuscation services</li>
          <li>Journalist and media monitoring</li>
          <li>Narrative reshaping through strategic press</li>
          <li>Legacy and stability focused messaging</li>
        </ul>
        <div class="mt-3 flex flex-wrap gap-2">
          <span class="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">Engage reputation partners</span>
          <span class="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">Deploy monitoring tools</span>
          <span class="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">Build media relationships</span>
          <span class="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">Track progress & adjust</span>
        </div>
      </div>
    </div>`,
    interpersonal: `<div class="space-y-4">
      <h4 class="font-semibold text-gray-900">Interpersonal Risk: High Risk</h4>
      <p class="text-sm">You have a highly controversial and disputed divorce that was cited several times in online sources. Additionally, you are remarried, but many of these same sources have noted that you are involved in extramarital affairs. Expectations for family members often match those of employees and may have created much of a similar cycle of turnover and burnout. At times others may perceive you as entitled to relationships that meet your needs over serving others.</p>

      <div class="mt-4 bg-red-50 p-4 rounded-lg border border-red-200">
        <h5 class="font-semibold text-red-900 mb-2">Recommended Actions:</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-red-700">
          <li>Engage professional relationship counseling for work and home dynamics</li>
          <li>Work with reputation management partners to clean up online profile</li>
          <li>Develop a perception change plan with PR specialists</li>
          <li>Create healthier boundaries in professional and personal relationships</li>
          <li>Address leadership style to reduce turnover and burnout patterns</li>
        </ul>
      </div>
    </div>`,
    cyber: `<div class="space-y-4">
      <h4 class="font-semibold text-gray-900">Data Breach & Credential Exposure - Medium Risk</h4>

      <div class="bg-gray-50 p-4 rounded-lg">
        <h5 class="font-semibold text-gray-800 mb-2">Critical Exposures Found:</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>Two personal logins reused across travel/event platforms</li>
          <li>Metadata exposing your children's educational affiliations</li>
          <li>Legal documents from prior divorce with partial financials</li>
          <li>Family data exposed in 5+ breach datasets</li>
        </ul>
      </div>

      <div class="mt-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h5 class="font-semibold text-orange-900 mb-2">Recommended Actions:</h5>
        <div class="flex flex-wrap gap-2">
          <span class="px-3 py-1 bg-orange-600 text-white text-xs rounded-full">Reset credentials</span>
          <span class="px-3 py-1 bg-orange-600 text-white text-xs rounded-full">Deploy monitoring</span>
          <span class="px-3 py-1 bg-orange-600 text-white text-xs rounded-full">Check family exposure</span>
          <span class="px-3 py-1 bg-orange-600 text-white text-xs rounded-full">Use encrypted platforms</span>
        </div>
        <p class="text-sm text-orange-700 mt-3">Transition core communications to encrypted platforms with rotating authentication.</p>
      </div>
    </div>`,
    corporate: `<div class="space-y-3">
      <h4 class="font-semibold text-gray-900">Corporate Integrity Risk</h4>
      <p class="text-sm">One former associate (SEC watchlist) flagged in corporate link analysis last week. Multiple online narratives link past SEC investigations to associations with indicted contacts.</p>

      <div class="mt-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h5 class="font-semibold text-orange-900 mb-2">Recommended Actions:</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-orange-700">
          <li>Conduct comprehensive audit of all professional relationships</li>
          <li>Create public distance from SEC-flagged associates</li>
          <li>Implement vetting process for new business connections</li>
          <li>Monitor and address online narratives linking to past investigations</li>
          <li>Establish compliance protocols for future partnerships</li>
        </ul>
      </div>
    </div>`,
    family: `<div class="space-y-3">
      <h4 class="font-semibold text-gray-900">Family Risk: Medium Risk</h4>
      <p class="text-sm">The increase in your family complexity with the divorce and the perception of extra marital relationships can impact the cohesion of your family structure and well being. Additionally, having high wealth may make you a target for familial exploitation. It will be important to monitor family contacts for relationship.</p>
      <p class="text-sm">Negative comments about you by your ex-wife were recently posted online.</p>

      <div class="mt-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h5 class="font-semibold text-orange-900 mb-2">Recommended Actions:</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-orange-700">
          <li>Engage family counseling to improve cohesion and communication</li>
          <li>Implement wealth protection strategies and trust structures</li>
          <li>Monitor and address negative online commentary from ex-spouse</li>
          <li>Establish clear boundaries to prevent familial exploitation</li>
          <li>Create family governance plan for high-net-worth dynamics</li>
        </ul>
      </div>
    </div>`,
    physical: `<div class="space-y-3">
      <h4 class="font-semibold text-gray-900">Physical Security Risk: Low Risk</h4>
      <p class="text-sm">While your physical security risk is minimal, I have mapped your pattern of life and found multiple points of tracking data almost continually mapping your movements. Historical patterns of movement are typically predictable and may alert nefarious actors to your current and future locations.</p>
      <p class="text-sm mt-2">The card to the right shows your most traveled locations. Tracking apps and wearables are documenting your position - your phone and Oura ring provide the most specific data.</p>

      <div class="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
        <h5 class="font-semibold text-green-900 mb-2">Recommended Actions:</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-green-700">
          <li>Limit location sharing on phone and wearable devices</li>
          <li>Review and adjust privacy settings on all tracking apps</li>
          <li>Vary travel patterns to reduce predictability</li>
          <li>Enable location obfuscation features where available</li>
          <li>Regular audits of apps with location permissions</li>
        </ul>
      </div>
    </div>`
  }

  // Preston's risk detailed descriptions
  const prestonRiskDetails: Record<string, string> = {
    gambling: `<div class="space-y-4">
      <h4 class="font-semibold text-gray-900">Gambling Addiction - CRITICAL RISK</h4>

      <div class="bg-red-50 p-4 rounded-lg">
        <h5 class="font-semibold text-red-800 mb-2">Transaction Pattern Analysis</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-red-700">
          <li>342 sports betting transactions identified via Venmo in past 10 months</li>
          <li>Escalating bet amounts: Started $200-500, now regularly $2,000-5,000 per week</li>
          <li>Net loss of $23,750 documented since January 2024</li>
          <li>Venmo notes include "lock," "parlay," "UT spread" - clear gambling terminology</li>
          <li>Finals week Vegas trip with $3,200 loss during critical exam period</li>
        </ul>
      </div>

      <div class="mt-4 bg-red-50 p-4 rounded-lg border border-red-200">
        <h5 class="font-semibold text-red-900 mb-2">Immediate Actions Required:</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-red-700">
          <li>Confront Preston with documented evidence in controlled setting</li>
          <li>Demand gambling addiction assessment and treatment enrollment</li>
          <li>Implement financial monitoring and trust fund controls</li>
          <li>Establish no-contact boundaries if intervention refused</li>
          <li>Document all gambling activity for potential legal proceedings</li>
        </ul>
      </div>
    </div>`,

    deception: `<div class="space-y-4">
      <h4 class="font-semibold text-gray-900">Systematic Deception - CRITICAL RISK</h4>

      <div class="bg-red-50 p-4 rounded-lg">
        <h5 class="font-semibold text-red-800 mb-2">Hidden Lifestyle Pattern</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-red-700">
          <li>12+ Las Vegas trips never disclosed to Sarah Schmidt</li>
          <li>Vegas travel during UT finals week - claimed to be "studying with friends"</li>
          <li>Instagram posts from Vegas quickly deleted or hidden from Sarah's view</li>
          <li>Separate friend groups: "gambling buddies" vs "girlfriend-approved friends"</li>
          <li>Double-booking: Tells Sarah one thing, does another in Vegas</li>
        </ul>
      </div>

      <div class="mt-4 bg-red-50 p-4 rounded-lg border border-red-200">
        <h5 class="font-semibold text-red-900 mb-2">Recommended Actions:</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-red-700">
          <li>Present timeline of deception to Sarah with evidence</li>
          <li>Demand full disclosure of gambling debts and Vegas activities</li>
          <li>Require Preston to account for all hidden travel and expenses</li>
          <li>Implement mandatory couples therapy if relationship continues</li>
          <li>Monitor for continued deceptive behavior patterns</li>
        </ul>
      </div>
    </div>`,

    narcissism: `<div class="space-y-4">
      <h4 class="font-semibold text-gray-900">Dark Triad Personality Traits - HIGH RISK</h4>

      <div class="bg-red-50 p-4 rounded-lg">
        <h5 class="font-semibold text-red-800 mb-2">Narcissistic Indicators</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-red-700">
          <li>1,847 Instagram posts analyzed - 75% show self-promotional content</li>
          <li>Captions like "Surround yourself with winners, not whiners"</li>
          <li>Constant need for external validation and admiration</li>
          <li>Exploits family name (Judge Whitaker) for social leverage</li>
          <li>Lacks empathy - blames others for gambling losses publicly</li>
        </ul>
      </div>

      <div class="bg-red-50 p-4 rounded-lg mt-3">
        <h5 class="font-semibold text-red-800 mb-2">Manipulative Behavior</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-red-700">
          <li>Adapts persona based on audience (family vs. gambling friends)</li>
          <li>Uses charm and family connections to gain trust</li>
          <li>Gaslights Sarah about whereabouts and financial situation</li>
          <li>Projects blame onto others when confronted</li>
        </ul>
      </div>

      <div class="mt-4 bg-red-50 p-4 rounded-lg border border-red-200">
        <h5 class="font-semibold text-red-900 mb-2">Recommended Actions:</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-red-700">
          <li>Psychological evaluation by Dark Triad specialist</li>
          <li>Educate Sarah on narcissistic relationship patterns</li>
          <li>Establish firm boundaries with consequences</li>
          <li>Monitor for escalating manipulative behavior</li>
          <li>Prepare exit strategy for Sarah if needed</li>
        </ul>
      </div>
    </div>`,

    family_exposure: `<div class="space-y-4">
      <h4 class="font-semibold text-gray-900">Schmidt Family Exposure Risk - HIGH</h4>

      <div class="bg-orange-50 p-4 rounded-lg">
        <h5 class="font-semibold text-orange-800 mb-2">Reputational Threat Vectors</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-orange-700">
          <li>Preston's gambling scandal could attach to Schmidt family name</li>
          <li>Robert Schmidt's business reputation at risk through association</li>
          <li>Philanthropic networks could view relationship as judgment lapse</li>
          <li>Whitaker family (Judge, VP connections) amplifies any public fallout</li>
          <li>Sarah's professional future compromised by association</li>
        </ul>
      </div>

      <div class="mt-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h5 class="font-semibold text-orange-900 mb-2">Recommended Actions:</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-orange-700">
          <li>Create public distance between Preston and Schmidt family events</li>
          <li>Prepare crisis communication plan for potential scandal</li>
          <li>Legal review of any financial entanglements</li>
          <li>Monitor media for emerging stories linking families</li>
          <li>Establish clear boundaries on family business exposure</li>
        </ul>
      </div>
    </div>`,

    volatility: `<div class="space-y-4">
      <h4 class="font-semibold text-gray-900">Behavioral Volatility - HIGH RISK</h4>

      <div class="bg-orange-50 p-4 rounded-lg">
        <h5 class="font-semibold text-orange-800 mb-2">Documented Outbursts</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-orange-700">
          <li>Public Instagram attack on UT football players: "Y'all cost me rent money"</li>
          <li>534 volatile/angry social media posts identified since January</li>
          <li>Increasing frequency: 72% of September posts were aggressive or narcissistic</li>
          <li>Targets athletes, referees, and betting platforms when losing</li>
          <li>Friends report Preston "explodes" when gambling losses mount</li>
        </ul>
      </div>

      <div class="mt-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h5 class="font-semibold text-orange-900 mb-2">Recommended Actions:</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm text-orange-700">
          <li>Anger management assessment and treatment requirement</li>
          <li>Monitor for escalating volatility toward Sarah</li>
          <li>Safety planning for Sarah if volatility increases</li>
          <li>Document all volatile incidents for protective orders if needed</li>
          <li>Assess for substance abuse compounding volatility</li>
        </ul>
      </div>
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
  const PRESTON_WHITAKER_ID = 'preston-cole-whitaker-iii'
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

  // Get Robert's personality profile
  const robertPersonality = computed(() => {
    const profile = getRobertPersonalityProfile()
    return {
      ...profile,
      traits: profile.traits.map(trait => ({
        ...trait,
        icon:
          trait.iconName === 'BoltIcon'
            ? BoltIcon
            : trait.iconName === 'UserGroupIcon'
              ? UserGroupIcon
              : trait.iconName === 'ShieldCheckIcon'
                ? ShieldCheckIcon
                : trait.iconName === 'LightBulbIcon'
                  ? LightBulbIcon
                  : trait.iconName === 'HandThumbUpIcon'
                    ? HandThumbUpIcon
                    : ExclamationTriangleIcon
      }))
    }
  })

  // Get Robert's tracking sources
  const robertTrackingSources = computed(() => {
    const sources = getRobertTrackingSources()
    return sources.map(source => ({
      ...source,
      icon:
        source.iconName === 'NewspaperIcon'
          ? NewspaperIcon
          : source.iconName === 'BriefcaseIcon'
            ? BriefcaseIcon
            : source.iconName === 'AtSymbolIcon'
              ? AtSymbolIcon
              : source.iconName === 'UsersIcon'
                ? UsersIcon
                : source.iconName === 'ChatBubbleLeftRightIcon'
                  ? ChatBubbleLeftRightIcon
                  : source.iconName === 'DocumentTextIcon'
                    ? DocumentTextIcon
                    : source.iconName === 'ShieldExclamationIcon'
                      ? ShieldExclamationIcon
                      : BuildingOfficeIcon
    }))
  })

  // Get Robert's summary and recommendations
  const robertSummary = computed(() => {
    const data = getRobertSummaryRecommendations()
    return {
      ...data,
      keyFindings: data.keyFindings.map(finding => ({
        ...finding,
        icon:
          finding.iconName === 'ExclamationTriangleIcon'
            ? ExclamationTriangleIcon
            : finding.iconName === 'HeartIcon'
              ? HeartIcon
              : finding.iconName === 'ShieldExclamationIcon'
                ? ShieldExclamationIcon
                : finding.iconName === 'UsersIcon'
                  ? UsersIcon
                  : finding.iconName === 'GlobeAltIcon'
                    ? GlobeAltIcon
                    : BuildingOfficeIcon
      })),
      recommendations: data.recommendations.map(rec => ({
        ...rec,
        icon:
          rec.iconName === 'FireIcon'
            ? FireIcon
            : rec.iconName === 'LockClosedIcon'
              ? LockClosedIcon
              : rec.iconName === 'AcademicCapIcon'
                ? AcademicCapIcon
                : rec.iconName === 'UserGroupIcon'
                  ? UserGroupIcon
                  : HomeIcon
      }))
    }
  })

  // Check if this is Preston Whitaker's dashboard
  const isPrestonWhitaker = computed(
    () => personId.value === PRESTON_WHITAKER_ID
  )

  // Get Preston's profile
  const prestonProfile = computed(() =>
    isPrestonWhitaker.value ? getPrestonProfile() : null
  )

  // Get Preston's life events
  const prestonLifeEvents = computed(() =>
    isPrestonWhitaker.value ? getPrestonLifeEvents() : []
  )

  // Get Preston's locations
  const prestonLocations = computed(() =>
    isPrestonWhitaker.value ? getPrestonLocations() : []
  )

  // Get Preston's network
  const prestonNetwork = computed(() =>
    isPrestonWhitaker.value ? getPrestonNetwork() : { nodes: [], links: [] }
  )

  // Get Preston's gambling transactions
  const prestonGamblingTransactions = computed(() =>
    isPrestonWhitaker.value ? getPrestonGamblingTransactions() : []
  )

  // Get Preston's social media sentiment
  const prestonSocialMediaSentiment = computed(() =>
    isPrestonWhitaker.value ? getPrestonSocialMediaSentiment() : []
  )

  // Get Preston's personality profile
  const prestonPersonality = computed(() => {
    if (!isPrestonWhitaker.value) return { summary: '', traits: [] }
    const data = getPrestonPersonalityProfile()
    return {
      ...data,
      traits: data.traits.map(trait => ({
        ...trait,
        icon:
          trait.icon === 'SparklesIcon'
            ? SparklesIcon
            : trait.icon === 'CurrencyDollarIcon'
              ? CurrencyDollarIcon
              : trait.icon === 'FireIcon'
                ? FireIcon
                : trait.icon === 'EyeSlashIcon'
                  ? EyeSlashIcon
                  : trait.icon === 'UserGroupIcon'
                    ? UserGroupIcon
                    : ShieldExclamationIcon
      }))
    }
  })

  // Get Preston's tracking sources
  const prestonTrackingSources = computed(() => {
    const sources = getPrestonTrackingSources()
    return sources.map(source => ({
      ...source,
      icon:
        source.iconName === 'CameraIcon'
          ? CameraIcon
          : source.iconName === 'CurrencyDollarIcon'
            ? CurrencyDollarIcon
            : source.iconName === 'MapPinIcon'
              ? MapPinIcon
              : source.iconName === 'AcademicCapIcon'
                ? AcademicCapIcon
                : source.iconName === 'UsersIcon'
                  ? UsersIcon
                  : source.iconName === 'ChartBarIcon'
                    ? ChartBarIcon
                    : source.iconName === 'ChatBubbleLeftRightIcon'
                      ? ChatBubbleLeftRightIcon
                      : BanknotesIcon
    }))
  })

  // Get Preston's summary and recommendations
  const prestonSummary = computed(() => {
    const data = getPrestonSummaryRecommendations()
    return {
      ...data,
      keyFindings: data.keyFindings.map(finding => ({
        ...finding,
        icon:
          finding.iconName === 'FireIcon'
            ? FireIcon
            : finding.iconName === 'EyeSlashIcon'
              ? EyeSlashIcon
              : finding.iconName === 'ExclamationTriangleIcon'
                ? ExclamationTriangleIcon
                : finding.iconName === 'HomeIcon'
                  ? HomeIcon
                  : finding.iconName === 'BuildingLibraryIcon'
                    ? BuildingLibraryIcon
                    : BoltIcon
      })),
      recommendations: data.recommendations.map(rec => ({
        ...rec,
        icon:
          rec.iconName === 'ShieldExclamationIcon'
            ? ShieldExclamationIcon
            : rec.iconName === 'LockClosedIcon'
              ? LockClosedIcon
              : rec.iconName === 'NewspaperIcon'
                ? NewspaperIcon
                : rec.iconName === 'ShieldCheckIcon'
                  ? ShieldCheckIcon
                  : DocumentTextIcon
      }))
    }
  })

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

  /**
   * Handles network node click events - navigates to Preston's dashboard
   */
  const handleNodeClick = (nodeId: string) => {
    if (nodeId === 'preston') {
      // Navigate to Preston's dashboard and scroll to top
      router.push({
        name: 'SearchDetail',
        params: { id: 'preston-cole-whitaker-iii' }
      })
      // Scroll to top after navigation
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
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
