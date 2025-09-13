/**
 * Pinia stores index file
 * Central export point for all application stores
 */

// Export store composables
export { useSearchStore } from './search'
export { useUIStore } from './ui'
export { useFiltersStore } from './filters'
export { useLightboxStore } from './lightbox'

// Export types
export type { SearchState } from './search'
export type { Theme, ViewMode, Notification } from './ui'
export type { AgeRange } from './filters'
export type { LightboxState } from './lightbox'
