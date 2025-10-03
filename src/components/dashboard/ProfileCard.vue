<template>
  <div
    class="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow"
  >
    <div class="flex items-start gap-6">
      <!-- Profile Image -->
      <div class="flex-shrink-0">
        <img
          :src="profileImage"
          :alt="name"
          class="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
        />
      </div>

      <!-- Profile Information -->
      <div class="flex-1">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h2 class="text-3xl font-bold text-gray-900 mb-1">{{ name }}</h2>
            <p v-if="title" class="text-lg text-gray-600 mb-2">{{ title }}</p>
          </div>
          <div
            v-if="membershipLevel"
            class="ml-4 flex flex-col items-end gap-2"
          >
            <span
              class="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg flex items-center gap-1"
            >
              <StarIcon class="w-4 h-4" />
              {{ membershipLevel }}
            </span>
            <div class="text-xs text-gray-500 font-medium">Premium Member</div>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div v-if="age" class="flex items-center gap-2">
            <CakeIcon class="w-6 h-6 text-gray-400" />
            <div>
              <div class="text-sm text-gray-500">Age</div>
              <div class="text-base font-semibold text-gray-900">{{ age }}</div>
            </div>
          </div>
          <div v-if="location" class="flex items-center gap-2">
            <MapPinIcon class="w-6 h-6 text-gray-400" />
            <div>
              <div class="text-sm text-gray-500">Location</div>
              <div class="text-base font-semibold text-gray-900">
                {{ location }}
              </div>
            </div>
          </div>
          <div v-if="maritalStatus" class="flex items-center gap-2">
            <HeartIcon class="w-6 h-6 text-gray-400" />
            <div>
              <div class="text-sm text-gray-500">Status</div>
              <div class="text-base font-semibold text-gray-900">
                {{ maritalStatus }}
              </div>
            </div>
          </div>
          <div v-if="netWorth" class="flex items-center gap-2">
            <CurrencyDollarIcon class="w-6 h-6 text-gray-400" />
            <div>
              <div class="text-sm text-gray-500">Net Worth</div>
              <div class="text-base font-semibold text-gray-900">
                {{ netWorth }}
              </div>
            </div>
          </div>
          <div v-if="occupation" class="flex items-center gap-2">
            <BriefcaseIcon class="w-6 h-6 text-gray-400" />
            <div>
              <div class="text-sm text-gray-500">Occupation</div>
              <div class="text-base font-semibold text-gray-900">
                {{ occupation }}
              </div>
            </div>
          </div>
          <div v-if="education" class="flex items-center gap-2">
            <AcademicCapIcon class="w-6 h-6 text-gray-400" />
            <div>
              <div class="text-sm text-gray-500">Education</div>
              <div class="text-base font-semibold text-gray-900">
                {{ education }}
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div v-if="$slots.default" class="mt-4 pt-4 border-t border-gray-200">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    CakeIcon,
    MapPinIcon,
    HeartIcon,
    CurrencyDollarIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    StarIcon
  } from '@heroicons/vue/24/solid'

  interface Props {
    name: string
    title?: string
    profileImage: string
    membershipLevel?: string
    age?: string
    location?: string
    maritalStatus?: string
    netWorth?: string
    occupation?: string
    education?: string
  }

  defineProps<Props>()
</script>
