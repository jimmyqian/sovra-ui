<template>
  <div class="bg-bg-card border border-border-light rounded-lg overflow-hidden">
    <div class="p-6 space-y-6">
      <!-- Image Gallery and Stats Section -->
      <div class="flex flex-wrap gap-6">
        <!-- Image Gallery -->
        <div class="flex-1" style="min-width: 300px">
          <div class="space-y-2">
            <!-- Top row - 4 images -->
            <div class="grid grid-cols-4 gap-2">
              <div
                v-for="(image, index) in person.images?.slice(0, 4) || []"
                :key="index"
                class="bg-gray-200 overflow-hidden"
                style="aspect-ratio: 1.85 / 1"
                :class="[
                  index === 0 ? 'rounded-tl-xl' : '',
                  index === 3 ? 'rounded-tr-xl' : ''
                ]"
              >
                <img
                  :src="image"
                  :alt="`${person.name} image ${index + 1}`"
                  class="w-full h-full object-cover object-center"
                />
              </div>
            </div>
            <!-- Bottom row - 3 images -->
            <div class="grid grid-cols-4 gap-2">
              <div
                v-for="(image, index) in person.images?.slice(4, 7) || []"
                :key="index + 4"
                class="bg-gray-200 overflow-hidden"
                style="aspect-ratio: 1.85 / 1"
                :class="[index === 0 ? 'rounded-bl-xl' : '']"
              >
                <img
                  :src="image"
                  :alt="`${person.name} image ${index + 5}`"
                  class="w-full h-full object-cover object-center"
                />
              </div>
              <!-- Image count indicator -->
              <div
                class="bg-card-dark rounded-br-xl overflow-hidden flex items-center justify-center"
                style="aspect-ratio: 1.85 / 1"
              >
                <span class="text-brand-orange font-medium text-sm"
                  >{{ person.imageCount ?? 21 }}+ Images</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="flex-1" style="min-width: 350px">
          <div class="grid grid-cols-4 gap-4">
            <!-- Height/Weight -->
            <div class="bg-gray-50 p-2.5 rounded-lg text-center">
              <div class="text-base font-semibold text-text-primary">
                {{ person.personal.height.split(' ')[0] }}
              </div>
              <div class="text-xs text-text-secondary uppercase">CMS</div>
              <div class="text-base font-semibold text-text-primary mt-0.5">
                {{ person.personal.weight.split(' ')[0] }}
              </div>
              <div class="text-xs text-text-secondary uppercase">KG</div>
            </div>

            <!-- Age -->
            <div class="bg-gray-50 p-2.5 rounded-lg text-center">
              <div class="text-xs text-text-secondary mb-0.5">Age</div>
              <div class="text-xl font-semibold text-text-primary">
                {{ person.stats.age }}
              </div>
              <div class="text-xs text-text-secondary">Years</div>
              <div class="text-xs text-text-secondary mt-0.5">
                {{ person.personal.birthDate }}
              </div>
            </div>

            <!-- Net Worth -->
            <div class="bg-gray-50 p-2.5 rounded-lg text-center">
              <div class="text-xs text-text-secondary mb-0.5">Net Worth</div>
              <div class="text-base font-semibold text-text-primary">
                {{ person.stats.netWorth.split(' ')[0] }}
              </div>
              <div class="text-xs text-text-secondary">
                {{ person.stats.netWorth.split(' ').slice(1).join(' ') }}
              </div>
              <div class="text-xs text-brand-orange">Reference</div>
            </div>

            <!-- Spouse -->
            <div class="bg-gray-50 p-2.5 rounded-lg text-center">
              <div class="text-xs text-text-secondary mb-1">Spouse</div>
              <div class="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-1"></div>
              <div class="text-xs font-semibold text-text-primary">
                {{ person.personal.spouse.split(' ')[0] }}
              </div>
              <div class="text-xs text-text-secondary">
                {{ person.personal.spouse.split(' ').slice(1).join(' ') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Accounts Section -->
      <div>
        <h3 class="text-sm font-medium text-text-primary mb-3">Accounts</h3>
        <div class="flex gap-3">
          <!-- Instagram -->
          <div
            class="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
              />
            </svg>
          </div>
          <!-- WhatsApp -->
          <div
            class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.894 3.488"
              />
            </svg>
          </div>
          <!-- Facebook -->
          <div
            class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
          </div>
          <!-- Additional placeholder accounts -->
          <div class="w-10 h-10 bg-gray-300 rounded-lg"></div>
          <div class="w-10 h-10 bg-gray-300 rounded-lg"></div>
          <div class="w-10 h-10 bg-gray-300 rounded-lg"></div>
          <div class="w-10 h-10 bg-gray-300 rounded-lg"></div>
          <div class="w-10 h-10 bg-gray-300 rounded-lg"></div>
          <div class="w-10 h-10 bg-gray-300 rounded-lg"></div>
        </div>
        <div class="mt-3">
          <button class="text-sm text-brand-orange hover:underline">
            Login for more details →
          </button>
        </div>
      </div>

      <!-- Three Column Section: Personal, Professional, Finance -->
      <div class="grid grid-cols-3 gap-6">
        <!-- Personal Column -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-text-primary">Personal</h3>

          <div class="space-y-3 text-sm">
            <div>
              <div class="text-text-secondary">Born</div>
              <div class="font-medium text-text-primary">
                {{ person.personal.birthDate }} Age {{ person.stats.age }} years
              </div>
            </div>

            <div>
              <div class="text-text-secondary">Place of birth</div>
              <div class="font-medium text-text-primary">
                {{ person.personal.birthPlace }}
              </div>
            </div>

            <div>
              <div class="text-text-secondary">Spouse</div>
              <div class="font-medium text-brand-orange">
                {{ person.personal.spouse }}
              </div>
            </div>

            <div>
              <div class="text-text-secondary">Live In</div>
              <div class="font-medium text-text-primary">
                {{ person.personal.currentLocation }}
              </div>
            </div>

            <div>
              <div class="text-text-secondary">Height/Weight</div>
              <div class="font-medium text-text-primary">
                {{ person.personal.height }} / {{ person.personal.weight }}
              </div>
            </div>

            <div>
              <div class="text-text-secondary">Education</div>
              <div class="font-medium text-text-primary">
                {{ person.personal.education.university }} School of Arts and
                Sciences ({{ person.personal.education.year }})
              </div>
              <div
                class="text-brand-orange text-sm hover:underline cursor-pointer"
              >
                Know More
              </div>
            </div>
          </div>
        </div>

        <!-- Professional Column -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-text-primary">Professional</h3>

          <div class="space-y-3 text-sm">
            <div>
              <div class="text-text-secondary">Current job title</div>
              <div class="font-medium text-text-primary">
                {{ person.professional.currentJob }}
              </div>
            </div>

            <div>
              <div class="text-text-secondary">avg pay</div>
              <div class="font-medium text-text-primary">
                {{ person.professional.avgPay }}
              </div>
            </div>

            <div>
              <div class="text-text-secondary">current employee</div>
              <div class="font-medium text-text-primary">
                {{ person.professional.currentEmployer }}
              </div>
            </div>

            <div>
              <div class="text-text-secondary">Time in current field</div>
              <div class="font-medium text-text-primary">
                {{ person.professional.timeInField }}
              </div>
            </div>

            <div>
              <div class="text-text-secondary">
                Boards/Charities/Voluntaries
              </div>
              <div class="font-medium text-text-primary">
                {{ person.professional.boards || 'N/A' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Finance Column -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-text-primary">Finance</h3>

          <div class="space-y-3 text-sm">
            <div>
              <div class="text-text-secondary">$$$ worth</div>
              <div class="text-text-secondary">(Credit score for B2B)</div>
            </div>

            <div>
              <div class="text-text-secondary">Housing status Rent/Own</div>
              <div class="font-medium text-text-primary">
                {{ person.finance.housingStatus }}
              </div>
            </div>

            <div>
              <div class="text-text-secondary">House worth</div>
              <div class="font-medium text-text-primary">
                {{ person.finance.houseWorth || 'N/A' }}
              </div>
            </div>

            <div>
              <div class="text-text-secondary">Business entities</div>
              <div class="font-medium text-text-primary">
                {{ person.finance.businessEntities || 'N/A' }}
              </div>
            </div>

            <div>
              <div class="text-text-secondary">Bis ent status</div>
              <div class="font-medium text-text-primary">
                {{ person.finance.businessStatus || 'N/A' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legal Section -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold text-text-primary mb-4">Legal</h3>
        <div class="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-text-secondary">News articles</span>
            <span class="text-text-primary">{{
              person.legal.newsArticles || 'N/A'
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">bankruptcies</span>
            <span class="text-text-primary">{{
              person.legal.bankruptcies || 'None'
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">child support</span>
            <span class="text-text-primary">{{
              person.legal.childSupport || 'N/A'
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">crimes</span>
            <span class="text-text-primary">{{
              person.legal.crimes || 'None'
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">alligations</span>
            <span class="text-text-primary">{{
              person.legal.allegations || 'None'
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface PersonStats {
    age: string
    netWorth: string
  }

  interface PersonalInfo {
    birthDate: string
    birthPlace: string
    spouse: string
    currentLocation: string
    height: string
    weight: string
    education: {
      university: string
      degree: string
      year: string
    }
  }

  interface ProfessionalInfo {
    currentJob: string
    avgPay: string
    currentEmployer: string
    timeInField: string
    boards?: string
  }

  interface FinanceInfo {
    worth: string
    creditScore?: string
    housingStatus: string
    houseWorth?: string
    businessEntities?: string
    businessStatus?: string
  }

  interface LegalInfo {
    newsArticles?: string
    bankruptcies?: string
    childSupport?: string
    crimes?: string
    allegations?: string
  }

  interface DetailedPerson {
    name: string
    profileImage?: string
    images?: string[]
    imageCount?: number
    stats: PersonStats
    personal: PersonalInfo
    professional: ProfessionalInfo
    finance: FinanceInfo
    legal: LegalInfo
  }

  interface Props {
    person: DetailedPerson
  }

  defineProps<Props>()
</script>
