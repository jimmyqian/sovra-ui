import type { SearchResult, FilterItem } from '@/types/search'

/**
 * Validates a search query string
 */
export const validateSearchQuery = (query: string): boolean => {
  return typeof query === 'string' && query.trim().length > 0
}

/**
 * Normalizes a search query by trimming whitespace and removing extra spaces
 */
export const normalizeSearchQuery = (query: string): string => {
  return query.trim().replace(/\s+/g, ' ')
}

/**
 * Formats a search query for URL encoding
 */
export const formatQueryForUrl = (query: string): string => {
  return encodeURIComponent(normalizeSearchQuery(query))
}

/**
 * Decodes a URL-encoded search query
 */
export const decodeQueryFromUrl = (encodedQuery: string): string => {
  try {
    return decodeURIComponent(encodedQuery)
  } catch {
    return encodedQuery // Return original if decoding fails
  }
}

/**
 * Filters search results based on a text query
 */
export const filterSearchResults = (
  results: SearchResult[],
  query: string
): SearchResult[] => {
  if (!validateSearchQuery(query)) {
    return results
  }

  const normalizedQuery = normalizeSearchQuery(query).toLowerCase()

  return results.filter(result => {
    const searchableText = [
      result.name,
      result.gender,
      result.maritalStatus,
      result.location
    ]
      .join(' ')
      .toLowerCase()

    return searchableText.includes(normalizedQuery)
  })
}

/**
 * Sorts search results by rating in descending order
 */
export const sortResultsByRating = (
  results: SearchResult[]
): SearchResult[] => {
  return [...results].sort((a, b) => b.rating - a.rating)
}

/**
 * Sorts search results by name alphabetically
 */
export const sortResultsByName = (results: SearchResult[]): SearchResult[] => {
  return [...results].sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Sorts search results by age
 */
export const sortResultsByAge = (
  results: SearchResult[],
  ascending = true
): SearchResult[] => {
  return [...results].sort((a, b) => {
    return ascending ? a.age - b.age : b.age - a.age
  })
}

/**
 * Calculates the average rating from a list of search results
 */
export const calculateAverageRating = (results: SearchResult[]): number => {
  if (results.length === 0) return 0

  const sum = results.reduce((total, result) => total + result.rating, 0)
  return Math.round((sum / results.length) * 100) / 100 // Round to 2 decimal places
}

/**
 * Groups search results by location
 */
export const groupResultsByLocation = (
  results: SearchResult[]
): Record<string, SearchResult[]> => {
  return results.reduce(
    (groups, result) => {
      const location = result.location
      groups[location] ??= []
      groups[location].push(result)
      return groups
    },
    {} as Record<string, SearchResult[]>
  )
}

/**
 * Creates a filter item from a search query
 */
export const createFilterFromQuery = (query: string): FilterItem => {
  return {
    id: `query-${Date.now()}`,
    text: normalizeSearchQuery(query),
    removable: true
  }
}

/**
 * Removes a filter item from a list by ID
 */
export const removeFilter = (
  filters: FilterItem[],
  filterId: string
): FilterItem[] => {
  return filters.filter(filter => filter.id !== filterId)
}

/**
 * Checks if a filter item is removable
 */
export const isFilterRemovable = (filter: FilterItem): boolean => {
  return filter.removable === true
}

/**
 * Gets the display text for a filter item
 */
export const getFilterDisplayText = (filter: FilterItem): string => {
  return filter.dropdownText ?? filter.text
}

/**
 * Validates search result data structure
 */
export const validateSearchResult = (
  result: unknown
): result is SearchResult => {
  if (typeof result !== 'object' || result === null) {
    return false
  }

  const obj = result as Record<string, unknown>
  return (
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.age === 'number' &&
    typeof obj.gender === 'string' &&
    typeof obj.maritalStatus === 'string' &&
    typeof obj.location === 'string' &&
    typeof obj.rating === 'number' &&
    typeof obj.references === 'number' &&
    typeof obj.companies === 'number' &&
    typeof obj.contacts === 'number' &&
    (obj.image === undefined || typeof obj.image === 'string')
  )
}

/**
 * Sanitizes search results array by removing invalid entries
 */
export const sanitizeSearchResults = (results: unknown[]): SearchResult[] => {
  return results.filter(validateSearchResult)
}

/**
 * Generates a summary of search results
 */
export const generateResultsSummary = (
  results: SearchResult[]
): {
  total: number
  averageAge: number
  averageRating: number
  topLocations: string[]
} => {
  if (results.length === 0) {
    return {
      total: 0,
      averageAge: 0,
      averageRating: 0,
      topLocations: []
    }
  }

  const averageAge = Math.round(
    results.reduce((sum, result) => sum + result.age, 0) / results.length
  )

  const locationCounts = groupResultsByLocation(results)
  const topLocations = Object.keys(locationCounts)
    .sort(
      (a, b) =>
        (locationCounts[b]?.length ?? 0) - (locationCounts[a]?.length ?? 0)
    )
    .slice(0, 3)

  return {
    total: results.length,
    averageAge,
    averageRating: calculateAverageRating(results),
    topLocations
  }
}
