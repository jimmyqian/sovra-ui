<template>
  <div
    class="bg-white rounded-2xl shadow-lg-modern p-8 mb-6 border border-slate-100 hover:shadow-xl-modern transition-all hover:-translate-y-1"
  >
    <div class="flex items-start gap-8">
      <!-- Profile Image -->
      <div class="flex-shrink-0">
        <div class="relative">
          <img
            :src="profileImage"
            :alt="name"
            class="w-36 h-36 rounded-2xl object-cover ring-4 ring-slate-100 shadow-md"
          />
          <div
            class="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-brand-accent to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Profile Information -->
      <div class="flex-1">
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <h2 class="text-4xl font-extrabold text-slate-900 mb-2">
              {{ name }}
            </h2>
            <p v-if="title" class="text-xl text-slate-600 font-medium">
              {{ title }}
            </p>
          </div>
          <div
            v-if="membershipLevel"
            class="ml-4 flex flex-col items-end gap-2"
          >
            <span
              class="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white shadow-xl flex items-center gap-2 transition-all duration-500"
            >
              <StarIcon class="w-5 h-5" />
              {{ membershipLevel }}
            </span>
            <div
              class="text-xs text-slate-500 font-semibold uppercase tracking-wide"
            >
              Premium Member
            </div>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-5">
          <div
            v-if="age"
            class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div
              class="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
            >
              <CakeIcon class="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div
                class="text-xs text-slate-500 font-medium uppercase tracking-wide"
              >
                Age
              </div>
              <div class="text-lg font-bold text-slate-900">{{ age }}</div>
            </div>
          </div>
          <div
            v-if="location"
            class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div
              class="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"
            >
              <MapPinIcon class="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div
                class="text-xs text-slate-500 font-medium uppercase tracking-wide"
              >
                Location
              </div>
              <div class="text-lg font-bold text-slate-900">{{ location }}</div>
            </div>
          </div>
          <div
            v-if="maritalStatus"
            class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div
              class="flex-shrink-0 w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center"
            >
              <HeartIcon class="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <div
                class="text-xs text-slate-500 font-medium uppercase tracking-wide"
              >
                Status
              </div>
              <div class="text-lg font-bold text-slate-900">
                {{ maritalStatus }}
              </div>
            </div>
          </div>
          <div
            v-if="netWorth"
            class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div
              class="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"
            >
              <CurrencyDollarIcon class="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div
                class="text-xs text-slate-500 font-medium uppercase tracking-wide"
              >
                Net Worth
              </div>
              <div class="text-lg font-bold text-slate-900">{{ netWorth }}</div>
            </div>
          </div>
          <div
            v-if="occupation"
            class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div
              class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <BriefcaseIcon class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div
                class="text-xs text-slate-500 font-medium uppercase tracking-wide"
              >
                Occupation
              </div>
              <div class="text-lg font-bold text-slate-900">
                {{ occupation }}
              </div>
            </div>
          </div>
          <div
            v-if="education"
            class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div
              class="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <AcademicCapIcon class="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div
                class="text-xs text-slate-500 font-medium uppercase tracking-wide"
              >
                Education
              </div>
              <div class="text-lg font-bold text-slate-900">
                {{ education }}
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div v-if="$slots.default" class="mt-6 pt-6 border-t border-slate-200">
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
