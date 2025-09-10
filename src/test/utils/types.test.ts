import { describe, it, expect } from 'vitest'
import type { SearchResult, FilterItem } from '@/types/search'

describe('Type Definitions', () => {
  describe('SearchResult interface', () => {
    it('accepts valid SearchResult objects', () => {
      const validSearchResult: SearchResult = {
        id: 1,
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        maritalStatus: 'Single',
        location: 'California',
        rating: 4.5,
        references: 25,
        companies: 5,
        contacts: 10
      }

      // Verify all required properties exist
      expect(validSearchResult.id).toBe(1)
      expect(validSearchResult.name).toBe('John Doe')
      expect(validSearchResult.age).toBe(30)
      expect(validSearchResult.gender).toBe('Male')
      expect(validSearchResult.maritalStatus).toBe('Single')
      expect(validSearchResult.location).toBe('California')
      expect(validSearchResult.rating).toBe(4.5)
      expect(validSearchResult.references).toBe(25)
      expect(validSearchResult.companies).toBe(5)
      expect(validSearchResult.contacts).toBe(10)
    })

    it('validates SearchResult property types', () => {
      const searchResult: SearchResult = {
        id: 123,
        name: 'Jane Smith',
        age: 28,
        gender: 'Female',
        maritalStatus: 'Married',
        location: 'New York',
        rating: 3.8,
        references: 30,
        companies: 8,
        contacts: 15
      }

      // Type validations
      expect(typeof searchResult.id).toBe('number')
      expect(typeof searchResult.name).toBe('string')
      expect(typeof searchResult.age).toBe('number')
      expect(typeof searchResult.gender).toBe('string')
      expect(typeof searchResult.maritalStatus).toBe('string')
      expect(typeof searchResult.location).toBe('string')
      expect(typeof searchResult.rating).toBe('number')
      expect(typeof searchResult.references).toBe('number')
      expect(typeof searchResult.companies).toBe('number')
      expect(typeof searchResult.contacts).toBe('number')
    })

    it('handles different gender values', () => {
      const maleResult: SearchResult = {
        id: 1,
        name: 'John',
        age: 25,
        gender: 'Male',
        maritalStatus: 'Single',
        location: 'Texas',
        rating: 4.0,
        references: 20,
        companies: 3,
        contacts: 8
      }

      const femaleResult: SearchResult = {
        id: 2,
        name: 'Jane',
        age: 27,
        gender: 'Female',
        maritalStatus: 'Single',
        location: 'Florida',
        rating: 4.2,
        references: 22,
        companies: 4,
        contacts: 9
      }

      expect(maleResult.gender).toBe('Male')
      expect(femaleResult.gender).toBe('Female')
    })

    it('handles different marital status values', () => {
      const singleResult: SearchResult = {
        id: 1,
        name: 'Alex',
        age: 24,
        gender: 'Male',
        maritalStatus: 'Single',
        location: 'Nevada',
        rating: 3.5,
        references: 15,
        companies: 2,
        contacts: 6
      }

      const marriedResult: SearchResult = {
        id: 2,
        name: 'Sarah',
        age: 32,
        gender: 'Female',
        maritalStatus: 'Married',
        location: 'Oregon',
        rating: 4.1,
        references: 28,
        companies: 6,
        contacts: 12
      }

      const divorcedResult: SearchResult = {
        id: 3,
        name: 'Mike',
        age: 38,
        gender: 'Male',
        maritalStatus: 'Divorced',
        location: 'Washington',
        rating: 3.9,
        references: 35,
        companies: 9,
        contacts: 18
      }

      expect(singleResult.maritalStatus).toBe('Single')
      expect(marriedResult.maritalStatus).toBe('Married')
      expect(divorcedResult.maritalStatus).toBe('Divorced')
    })

    it('handles various rating ranges', () => {
      const lowRatingResult: SearchResult = {
        id: 1,
        name: 'Test User',
        age: 25,
        gender: 'Male',
        maritalStatus: 'Single',
        location: 'Test Location',
        rating: 1.0,
        references: 5,
        companies: 1,
        contacts: 2
      }

      const highRatingResult: SearchResult = {
        id: 2,
        name: 'Another User',
        age: 30,
        gender: 'Female',
        maritalStatus: 'Married',
        location: 'Another Location',
        rating: 5.0,
        references: 50,
        companies: 15,
        contacts: 25
      }

      expect(lowRatingResult.rating).toBe(1.0)
      expect(highRatingResult.rating).toBe(5.0)
      expect(lowRatingResult.rating).toBeGreaterThanOrEqual(1.0)
      expect(highRatingResult.rating).toBeLessThanOrEqual(5.0)
    })

    it('works with array of SearchResult objects', () => {
      const searchResults: SearchResult[] = [
        {
          id: 1,
          name: 'Person One',
          age: 25,
          gender: 'Male',
          maritalStatus: 'Single',
          location: 'City A',
          rating: 4.0,
          references: 20,
          companies: 3,
          contacts: 8
        },
        {
          id: 2,
          name: 'Person Two',
          age: 30,
          gender: 'Female',
          maritalStatus: 'Married',
          location: 'City B',
          rating: 4.5,
          references: 25,
          companies: 5,
          contacts: 12
        }
      ]

      expect(searchResults).toHaveLength(2)
      expect(searchResults[0].id).toBe(1)
      expect(searchResults[1].id).toBe(2)

      searchResults.forEach(result => {
        expect(typeof result.id).toBe('number')
        expect(typeof result.name).toBe('string')
        expect(typeof result.age).toBe('number')
        expect(typeof result.rating).toBe('number')
      })
    })
  })

  describe('FilterItem interface', () => {
    it('accepts FilterItem with required properties only', () => {
      const basicFilter: FilterItem = {
        id: 'age-filter',
        text: '25-35 years'
      }

      expect(basicFilter.id).toBe('age-filter')
      expect(basicFilter.text).toBe('25-35 years')
      expect(basicFilter.removable).toBeUndefined()
      expect(basicFilter.hasDropdown).toBeUndefined()
      expect(basicFilter.dropdownText).toBeUndefined()
    })

    it('accepts FilterItem with all optional properties', () => {
      const fullFilter: FilterItem = {
        id: 'location-filter',
        text: 'California',
        removable: true,
        hasDropdown: true,
        dropdownText: 'Select City'
      }

      expect(fullFilter.id).toBe('location-filter')
      expect(fullFilter.text).toBe('California')
      expect(fullFilter.removable).toBe(true)
      expect(fullFilter.hasDropdown).toBe(true)
      expect(fullFilter.dropdownText).toBe('Select City')
    })

    it('validates FilterItem property types', () => {
      const filter: FilterItem = {
        id: 'test-filter',
        text: 'Test Filter',
        removable: false,
        hasDropdown: false,
        dropdownText: 'Test Dropdown'
      }

      expect(typeof filter.id).toBe('string')
      expect(typeof filter.text).toBe('string')
      expect(typeof filter.removable).toBe('boolean')
      expect(typeof filter.hasDropdown).toBe('boolean')
      expect(typeof filter.dropdownText).toBe('string')
    })

    it('handles FilterItem with mixed optional properties', () => {
      const filterWithSomeOptions: FilterItem = {
        id: 'mixed-filter',
        text: 'Mixed Options',
        removable: true
        // hasDropdown and dropdownText are omitted
      }

      expect(filterWithSomeOptions.removable).toBe(true)
      expect(filterWithSomeOptions.hasDropdown).toBeUndefined()
      expect(filterWithSomeOptions.dropdownText).toBeUndefined()
    })

    it('works with array of FilterItem objects', () => {
      const filters: FilterItem[] = [
        {
          id: 'filter-1',
          text: 'First Filter',
          removable: true
        },
        {
          id: 'filter-2',
          text: 'Second Filter',
          hasDropdown: true,
          dropdownText: 'Options'
        },
        {
          id: 'filter-3',
          text: 'Third Filter'
        }
      ]

      expect(filters).toHaveLength(3)
      expect(filters[0].removable).toBe(true)
      expect(filters[1].hasDropdown).toBe(true)
      expect(filters[2].removable).toBeUndefined()

      filters.forEach(filter => {
        expect(typeof filter.id).toBe('string')
        expect(typeof filter.text).toBe('string')
      })
    })

    it('handles boolean properties correctly', () => {
      const removableFilter: FilterItem = {
        id: 'removable',
        text: 'Removable Filter',
        removable: true
      }

      const nonRemovableFilter: FilterItem = {
        id: 'non-removable',
        text: 'Non-Removable Filter',
        removable: false
      }

      const dropdownFilter: FilterItem = {
        id: 'dropdown',
        text: 'Dropdown Filter',
        hasDropdown: true
      }

      const noDropdownFilter: FilterItem = {
        id: 'no-dropdown',
        text: 'No Dropdown Filter',
        hasDropdown: false
      }

      expect(removableFilter.removable).toBe(true)
      expect(nonRemovableFilter.removable).toBe(false)
      expect(dropdownFilter.hasDropdown).toBe(true)
      expect(noDropdownFilter.hasDropdown).toBe(false)
    })

    it('validates complex filter scenarios', () => {
      const complexFilter: FilterItem = {
        id: 'complex-age-location',
        text: 'Johnson × who × is around 26 ▼ years old, Works ▼ in a Software ▼ company in California ▼',
        removable: true,
        hasDropdown: true,
        dropdownText: 'Edit criteria'
      }

      expect(complexFilter.text).toContain('Johnson')
      expect(complexFilter.text).toContain('26')
      expect(complexFilter.text).toContain('California')
      expect(complexFilter.removable).toBe(true)
      expect(complexFilter.hasDropdown).toBe(true)
      expect(complexFilter.dropdownText).toBe('Edit criteria')
    })
  })

  describe('Type compatibility and usage patterns', () => {
    it('SearchResult works with common data manipulation functions', () => {
      const results: SearchResult[] = [
        {
          id: 1,
          name: 'Alice',
          age: 25,
          gender: 'Female',
          maritalStatus: 'Single',
          location: 'California',
          rating: 4.2,
          references: 20,
          companies: 3,
          contacts: 8
        },
        {
          id: 2,
          name: 'Bob',
          age: 30,
          gender: 'Male',
          maritalStatus: 'Married',
          location: 'New York',
          rating: 3.8,
          references: 15,
          companies: 2,
          contacts: 6
        }
      ]

      // Test filtering
      const californiaResults = results.filter(r => r.location === 'California')
      expect(californiaResults).toHaveLength(1)

      // Test mapping
      const names = results.map(r => r.name)
      expect(names).toEqual(['Alice', 'Bob'])

      // Test sorting
      const sortedByRating = [...results].sort((a, b) => b.rating - a.rating)
      expect(sortedByRating[0].rating).toBe(4.2)
    })

    it('FilterItem works with filter management operations', () => {
      const filters: FilterItem[] = [
        { id: 'age', text: '25-35', removable: true },
        { id: 'location', text: 'California', removable: true },
        { id: 'status', text: 'Single', removable: false }
      ]

      // Test filtering removable items
      const removableFilters = filters.filter(f => f.removable === true)
      expect(removableFilters).toHaveLength(2)

      // Test finding specific filter
      const locationFilter = filters.find(f => f.id === 'location')
      expect(locationFilter?.text).toBe('California')

      // Test adding new filter
      const newFilter: FilterItem = {
        id: 'company',
        text: 'Tech Company',
        hasDropdown: true,
        dropdownText: 'Select Company Type'
      }

      const updatedFilters = [...filters, newFilter]
      expect(updatedFilters).toHaveLength(4)
    })
  })
})
