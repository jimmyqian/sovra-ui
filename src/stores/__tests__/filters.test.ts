/**
 * Unit tests for the filters store
 * Tests filter state management, age ranges, locations, and sorting
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFiltersStore } from '../filters'

describe('Filters Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useFiltersStore()

      expect(store.ageRange).toEqual({ min: 18, max: 65 })
      expect(store.selectedLocations).toEqual([])
      expect(store.selectedCompanies).toEqual([])
      expect(store.minRating).toBe(0)
      expect(store.sortBy).toBe('relevance')
      expect(store.sortOrder).toBe('desc')
    })

    it('should have correct initial computed values', () => {
      const store = useFiltersStore()

      expect(store.hasActiveFilters).toBe(false)
      expect(store.activeFilterCount).toBe(0)
    })
  })

  describe('Age Range Management', () => {
    it('should set age range', () => {
      const store = useFiltersStore()
      const newRange = { min: 25, max: 45 }

      store.setAgeRange(newRange)

      expect(store.ageRange).toEqual(newRange)
      expect(store.hasActiveFilters).toBe(true)
      expect(store.activeFilterCount).toBe(1)
    })

    it('should not change age range if same as default', () => {
      const store = useFiltersStore()
      const defaultRange = { min: 18, max: 65 }

      store.setAgeRange(defaultRange)

      expect(store.hasActiveFilters).toBe(false)
      expect(store.activeFilterCount).toBe(0)
    })

    it('should validate age range bounds', () => {
      const store = useFiltersStore()

      store.setAgeRange({ min: 30, max: 25 })

      expect(store.ageRange.min).toBeLessThanOrEqual(store.ageRange.max)
    })
  })

  describe('Location Management', () => {
    it('should add location to selection', () => {
      const store = useFiltersStore()
      const location = 'New York'

      store.addLocation(location)

      expect(store.selectedLocations).toContain(location)
      expect(store.hasActiveFilters).toBe(true)
      expect(store.activeFilterCount).toBe(1)
    })

    it('should not add duplicate locations', () => {
      const store = useFiltersStore()
      const location = 'New York'

      store.addLocation(location)
      store.addLocation(location)

      expect(store.selectedLocations).toEqual([location])
      expect(store.selectedLocations).toHaveLength(1)
    })

    it('should remove location from selection', () => {
      const store = useFiltersStore()
      const location = 'New York'

      store.addLocation(location)
      store.removeLocation(location)

      expect(store.selectedLocations).not.toContain(location)
      expect(store.hasActiveFilters).toBe(false)
    })

    it('should toggle location selection', () => {
      const store = useFiltersStore()
      const location = 'New York'

      store.toggleLocation(location)
      expect(store.selectedLocations).toContain(location)

      store.toggleLocation(location)
      expect(store.selectedLocations).not.toContain(location)
    })

    it('should set multiple locations', () => {
      const store = useFiltersStore()
      const locations = ['New York', 'Los Angeles', 'Chicago']

      store.setLocations(locations)

      expect(store.selectedLocations).toEqual(locations)
      expect(store.activeFilterCount).toBe(1)
    })

    it('should clear all locations', () => {
      const store = useFiltersStore()

      store.setLocations(['New York', 'Los Angeles'])
      store.clearLocations()

      expect(store.selectedLocations).toEqual([])
    })
  })

  describe('Company Management', () => {
    it('should add company to selection', () => {
      const store = useFiltersStore()
      const company = 'Google'

      store.addCompany(company)

      expect(store.selectedCompanies).toContain(company)
      expect(store.hasActiveFilters).toBe(true)
    })

    it('should not add duplicate companies', () => {
      const store = useFiltersStore()
      const company = 'Google'

      store.addCompany(company)
      store.addCompany(company)

      expect(store.selectedCompanies).toEqual([company])
      expect(store.selectedCompanies).toHaveLength(1)
    })

    it('should remove company from selection', () => {
      const store = useFiltersStore()
      const company = 'Google'

      store.addCompany(company)
      store.removeCompany(company)

      expect(store.selectedCompanies).not.toContain(company)
    })

    it('should toggle company selection', () => {
      const store = useFiltersStore()
      const company = 'Google'

      store.toggleCompany(company)
      expect(store.selectedCompanies).toContain(company)

      store.toggleCompany(company)
      expect(store.selectedCompanies).not.toContain(company)
    })

    it('should set multiple companies', () => {
      const store = useFiltersStore()
      const companies = ['Google', 'Apple', 'Microsoft']

      store.setCompanies(companies)

      expect(store.selectedCompanies).toEqual(companies)
      expect(store.activeFilterCount).toBe(1)
    })

    it('should clear all companies', () => {
      const store = useFiltersStore()

      store.setCompanies(['Google', 'Apple'])
      store.clearCompanies()

      expect(store.selectedCompanies).toEqual([])
    })
  })

  describe('Rating Management', () => {
    it('should set minimum rating', () => {
      const store = useFiltersStore()
      const rating = 4.0

      store.setMinRating(rating)

      expect(store.minRating).toBe(rating)
      expect(store.hasActiveFilters).toBe(true)
      expect(store.activeFilterCount).toBe(1)
    })

    it('should not count zero rating as active filter', () => {
      const store = useFiltersStore()

      store.setMinRating(0)

      expect(store.hasActiveFilters).toBe(false)
      expect(store.activeFilterCount).toBe(0)
    })

    it('should validate rating bounds', () => {
      const store = useFiltersStore()

      store.setMinRating(-1)
      expect(store.minRating).toBeGreaterThanOrEqual(0)

      store.setMinRating(6)
      expect(store.minRating).toBeLessThanOrEqual(5)
    })
  })

  describe('Sorting Management', () => {
    it('should set sort by field', () => {
      const store = useFiltersStore()

      store.setSortBy('name')
      expect(store.sortBy).toBe('name')

      store.setSortBy('age')
      expect(store.sortBy).toBe('age')

      store.setSortBy('rating')
      expect(store.sortBy).toBe('rating')
    })

    it('should set sort order', () => {
      const store = useFiltersStore()

      store.setSortOrder('asc')
      expect(store.sortOrder).toBe('asc')

      store.setSortOrder('desc')
      expect(store.sortOrder).toBe('desc')
    })

    it('should toggle sort order', () => {
      const store = useFiltersStore()

      expect(store.sortOrder).toBe('desc')

      store.toggleSortOrder()
      expect(store.sortOrder).toBe('asc')

      store.toggleSortOrder()
      expect(store.sortOrder).toBe('desc')
    })

    it('should set sorting with both field and order', () => {
      const store = useFiltersStore()

      store.setSorting('name', 'asc')

      expect(store.sortBy).toBe('name')
      expect(store.sortOrder).toBe('asc')
    })

    it('should not count default sorting as active filter', () => {
      const store = useFiltersStore()

      store.setSorting('relevance', 'desc')

      expect(store.hasActiveFilters).toBe(false)
      expect(store.activeFilterCount).toBe(0)
    })

    it('should count non-default sorting as active filter', () => {
      const store = useFiltersStore()

      store.setSorting('name', 'asc')

      expect(store.hasActiveFilters).toBe(true)
      expect(store.activeFilterCount).toBe(1)
    })
  })

  describe('Filter State Management', () => {
    it('should count multiple active filters correctly', () => {
      const store = useFiltersStore()

      store.setAgeRange({ min: 25, max: 35 })
      store.addLocation('New York')
      store.setMinRating(4.0)

      expect(store.activeFilterCount).toBe(3)
      expect(store.hasActiveFilters).toBe(true)
    })

    it('should reset all filters', () => {
      const store = useFiltersStore()

      store.setAgeRange({ min: 25, max: 35 })
      store.addLocation('New York')
      store.addCompany('Google')
      store.setMinRating(4.0)
      store.setSorting('name', 'asc')

      store.resetFilters()

      expect(store.ageRange).toEqual({ min: 18, max: 65 })
      expect(store.selectedLocations).toEqual([])
      expect(store.selectedCompanies).toEqual([])
      expect(store.minRating).toBe(0)
      expect(store.sortBy).toBe('relevance')
      expect(store.sortOrder).toBe('desc')
      expect(store.hasActiveFilters).toBe(false)
      expect(store.activeFilterCount).toBe(0)
    })

    it('should get filter summary', () => {
      const store = useFiltersStore()

      store.setAgeRange({ min: 25, max: 35 })
      store.addLocation('New York')
      store.setMinRating(4.0)

      const summary = store.getFilterSummary()

      expect(summary).toContain('Age: 25-35')
      expect(summary).toContain('Location: New York')
      expect(summary).toContain('Min Rating: 4')
    })

    it('should get empty filter summary when no filters active', () => {
      const store = useFiltersStore()

      const summary = store.getFilterSummary()

      expect(summary).toBe('')
    })
  })

  describe('Filter Application', () => {
    const mockResults = [
      {
        id: 'test-uuid-1',
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        maritalStatus: 'Single',
        location: 'New York',
        rating: 4.5,
        references: 5,
        companies: 3,
        contacts: 12
      },
      {
        id: 'test-uuid-2',
        name: 'Jane Smith',
        age: 25,
        gender: 'Female',
        maritalStatus: 'Married',
        location: 'Los Angeles',
        rating: 3.8,
        references: 3,
        companies: 2,
        contacts: 8
      },
      {
        id: 'test-uuid-3',
        name: 'Bob Johnson',
        age: 35,
        gender: 'Male',
        maritalStatus: 'Married',
        location: 'New York',
        rating: 4.8,
        references: 7,
        companies: 5,
        contacts: 15
      }
    ]

    it('should apply age range filter', () => {
      const store = useFiltersStore()

      store.setAgeRange({ min: 28, max: 32 })
      const filtered = store.applyFilters(mockResults)

      expect(filtered).toHaveLength(1)
      expect(filtered[0]?.name).toBe('John Doe')
    })

    it('should apply location filter', () => {
      const store = useFiltersStore()

      store.addLocation('New York')
      const filtered = store.applyFilters(mockResults)

      expect(filtered).toHaveLength(2)
      expect(filtered.every(r => r.location === 'New York')).toBe(true)
    })

    it('should apply rating filter', () => {
      const store = useFiltersStore()

      store.setMinRating(4.0)
      const filtered = store.applyFilters(mockResults)

      expect(filtered).toHaveLength(2)
      expect(filtered.every(r => r.rating >= 4.0)).toBe(true)
    })

    it('should apply multiple filters', () => {
      const store = useFiltersStore()

      store.setAgeRange({ min: 30, max: 40 })
      store.addLocation('New York')
      store.setMinRating(4.0)

      const filtered = store.applyFilters(mockResults)

      expect(filtered).toHaveLength(1)
      expect(filtered[0]?.name).toBe('Bob Johnson')
    })

    it('should return all results when no filters active', () => {
      const store = useFiltersStore()

      const filtered = store.applyFilters(mockResults)

      expect(filtered).toEqual(mockResults)
    })
  })
})
