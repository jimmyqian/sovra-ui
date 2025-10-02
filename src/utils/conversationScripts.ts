/**
 * Conversation scripts for different search queries
 */
import type { SearchResult } from '@/types/search'

export interface ConversationScript {
  responses: string[]
  resultStages: SearchResult[][]
}

export interface DetailScript {
  responses: string[]
}

/**
 * Generate hardcoded search results for default fallback (kept for backwards compatibility)
 */
function generateScriptedResults(
  baseName: string,
  count: number,
  startId = 1
): SearchResult[] {
  const results: SearchResult[] = []
  const locations = [
    'California',
    'New York',
    'Texas',
    'Florida',
    'Illinois',
    'Pennsylvania',
    'Ohio',
    'Georgia'
  ]
  const maritalStatuses = ['Single', 'Married', 'Divorced']

  for (let i = 0; i < count; i++) {
    results.push({
      id: startId + i,
      name: `${baseName} ${startId + i}`,
      age: 25 + ((i * 3) % 50), // Ages between 25-75
      gender: i % 2 === 0 ? 'Male' : 'Female',
      maritalStatus: maritalStatuses[i % 3] ?? 'Single',
      location: locations[i % locations.length] ?? 'California',
      rating: Math.round((3.5 + i * 0.3) * 10) / 10, // Ratings 3.5-5.0
      references: 15 + i * 5, // References 15-50+
      companies: 2 + (i % 8), // Companies 2-9
      contacts: 10 + i * 3, // Contacts 10-30+
      image: `https://picsum.photos/240/240?random=${400 + startId + i}`
    })
  }

  return results
}

/**
 * Get the appropriate conversation script based on the search query
 */
export function getConversationScript(query: string): ConversationScript {
  const normalizedQuery = query.toLowerCase().trim()

  // Check for John Caruso (case insensitive)
  if (normalizedQuery.includes('john caruso')) {
    return {
      responses: [
        'John Caruso response 1',
        'John Caruso response 2',
        'John Caruso response 3'
      ],
      resultStages: [
        // Initial: 8 results
        [
          {
            id: 1,
            name: 'John Caruso 1',
            age: 28,
            gender: 'Male',
            maritalStatus: 'Single',
            location: 'California',
            rating: 4.2,
            references: 23,
            companies: 3,
            contacts: 15,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc1.webp'
          },
          {
            id: 2,
            name: 'John Caruso 2',
            age: 34,
            gender: 'Male',
            maritalStatus: 'Married',
            location: 'California',
            rating: 4.5,
            references: 31,
            companies: 2,
            contacts: 22,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc2.jpg'
          },
          {
            id: 3,
            name: 'John Caruso 3',
            age: 29,
            gender: 'Male',
            maritalStatus: 'Single',
            location: 'Texas',
            rating: 3.8,
            references: 18,
            companies: 4,
            contacts: 12,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc3.jpg'
          },
          {
            id: 4,
            name: 'John Caruso 4',
            age: 42,
            gender: 'Male',
            maritalStatus: 'Divorced',
            location: 'California',
            rating: 4.7,
            references: 45,
            companies: 5,
            contacts: 28,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc4.webp'
          },
          {
            id: 5,
            name: 'John Caruso 5',
            age: 31,
            gender: 'Male',
            maritalStatus: 'Single',
            location: 'Illinois',
            rating: 4.1,
            references: 27,
            companies: 3,
            contacts: 19,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc5.jpg'
          },
          {
            id: 6,
            name: 'John Caruso 6',
            age: 38,
            gender: 'Male',
            maritalStatus: 'Married',
            location: 'California',
            rating: 4.3,
            references: 36,
            companies: 6,
            contacts: 25,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc6.jpeg'
          },
          {
            id: 7,
            name: 'John Caruso 7',
            age: 26,
            gender: 'Male',
            maritalStatus: 'Single',
            location: 'Ohio',
            rating: 3.9,
            references: 21,
            companies: 2,
            contacts: 14,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc7.jpg'
          },
          {
            id: 8,
            name: 'John Caruso 8',
            age: 35,
            gender: 'Male',
            maritalStatus: 'Married',
            location: 'Georgia',
            rating: 4.6,
            references: 39,
            companies: 4,
            contacts: 26,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc8.jpg'
          }
        ],
        // Stage 1: 4 results (subset of initial 8)
        [
          {
            id: 1,
            name: 'John Caruso 1',
            age: 28,
            gender: 'Male',
            maritalStatus: 'Single',
            location: 'California',
            rating: 4.2,
            references: 23,
            companies: 3,
            contacts: 15,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc1.webp'
          },
          {
            id: 2,
            name: 'John Caruso 2',
            age: 34,
            gender: 'Male',
            maritalStatus: 'Married',
            location: 'California',
            rating: 4.5,
            references: 31,
            companies: 2,
            contacts: 22,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc2.jpg'
          },
          {
            id: 4,
            name: 'John Caruso 4',
            age: 42,
            gender: 'Male',
            maritalStatus: 'Divorced',
            location: 'California',
            rating: 4.7,
            references: 45,
            companies: 5,
            contacts: 28,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc4.webp'
          },
          {
            id: 6,
            name: 'John Caruso 6',
            age: 38,
            gender: 'Male',
            maritalStatus: 'Married',
            location: 'California',
            rating: 4.3,
            references: 36,
            companies: 6,
            contacts: 25,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc6.jpeg'
          }
        ],
        // Stage 2: 3 results (subset of stage 1)
        [
          {
            id: 1,
            name: 'John Caruso 1',
            age: 28,
            gender: 'Male',
            maritalStatus: 'Single',
            location: 'California',
            rating: 4.2,
            references: 23,
            companies: 3,
            contacts: 15,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc1.webp'
          },
          {
            id: 2,
            name: 'John Caruso 2',
            age: 34,
            gender: 'Male',
            maritalStatus: 'Married',
            location: 'California',
            rating: 4.5,
            references: 31,
            companies: 2,
            contacts: 22,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc2.jpg'
          },
          {
            id: 4,
            name: 'John Caruso 4',
            age: 42,
            gender: 'Male',
            maritalStatus: 'Divorced',
            location: 'California',
            rating: 4.7,
            references: 45,
            companies: 5,
            contacts: 28,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc4.webp'
          }
        ],
        // Stage 3: 1 result (subset of stage 2)
        [
          {
            id: 2,
            name: 'John Caruso 2',
            age: 34,
            gender: 'Male',
            maritalStatus: 'Married',
            location: 'California',
            rating: 4.5,
            references: 31,
            companies: 2,
            contacts: 22,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc2.jpg'
          }
        ]
      ]
    }
  }

  // Check for Von Miller (case insensitive)
  if (normalizedQuery.includes('von miller')) {
    return {
      responses: [
        'Von Miller response 1',
        'Von Miller response 2',
        'Von Miller response 3'
      ],
      resultStages: [
        // Initial: 8 results
        [
          {
            id: 1,
            name: 'Von Miller 1',
            age: 33,
            gender: 'Male',
            maritalStatus: 'Single',
            location: 'Virginia',
            rating: 4.6,
            references: 28,
            companies: 4,
            contacts: 19,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm1.jpeg'
          },
          {
            id: 2,
            name: 'Von Miller 2',
            age: 29,
            gender: 'Male',
            maritalStatus: 'Married',
            location: 'Virginia',
            rating: 4.3,
            references: 35,
            companies: 3,
            contacts: 24,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm2.jpg'
          },
          {
            id: 3,
            name: 'Von Miller 3',
            age: 31,
            gender: 'Male',
            maritalStatus: 'Single',
            location: 'Texas',
            rating: 4.0,
            references: 22,
            companies: 5,
            contacts: 16,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm3.jpg'
          },
          {
            id: 4,
            name: 'Von Miller 4',
            age: 36,
            gender: 'Male',
            maritalStatus: 'Divorced',
            location: 'Virginia',
            rating: 4.8,
            references: 41,
            companies: 6,
            contacts: 31,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm4.jpg'
          },
          {
            id: 5,
            name: 'Von Miller 5',
            age: 27,
            gender: 'Male',
            maritalStatus: 'Single',
            location: 'Florida',
            rating: 3.9,
            references: 19,
            companies: 2,
            contacts: 13,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm5.jpg'
          },
          {
            id: 6,
            name: 'Von Miller 6',
            age: 40,
            gender: 'Male',
            maritalStatus: 'Married',
            location: 'Georgia',
            rating: 4.5,
            references: 38,
            companies: 7,
            contacts: 27,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm6.webp'
          },
          {
            id: 7,
            name: 'Von Miller 7',
            age: 32,
            gender: 'Male',
            maritalStatus: 'Single',
            location: 'Arizona',
            rating: 4.1,
            references: 25,
            companies: 3,
            contacts: 18,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm7.webp'
          },
          {
            id: 8,
            name: 'Von Miller 8',
            age: 35,
            gender: 'Male',
            maritalStatus: 'Married',
            location: 'Virginia',
            rating: 4.7,
            references: 43,
            companies: 5,
            contacts: 29,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm8.jpg'
          }
        ],
        // Stage 1: 4 results (subset of initial 8)
        [
          {
            id: 1,
            name: 'Von Miller 1',
            age: 33,
            gender: 'Male',
            maritalStatus: 'Single',
            location: 'Virginia',
            rating: 4.6,
            references: 28,
            companies: 4,
            contacts: 19,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm1.jpeg'
          },
          {
            id: 2,
            name: 'Von Miller 2',
            age: 29,
            gender: 'Male',
            maritalStatus: 'Married',
            location: 'Virginia',
            rating: 4.3,
            references: 35,
            companies: 3,
            contacts: 24,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm2.jpg'
          },
          {
            id: 4,
            name: 'Von Miller 4',
            age: 36,
            gender: 'Male',
            maritalStatus: 'Divorced',
            location: 'Virginia',
            rating: 4.8,
            references: 41,
            companies: 6,
            contacts: 31,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm4.jpg'
          },
          {
            id: 8,
            name: 'Von Miller 8',
            age: 35,
            gender: 'Male',
            maritalStatus: 'Married',
            location: 'Virginia',
            rating: 4.7,
            references: 43,
            companies: 5,
            contacts: 29,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm8.jpg'
          }
        ],
        // Stage 2: 3 results (subset of stage 1)
        [
          {
            id: 1,
            name: 'Von Miller 1',
            age: 33,
            gender: 'Male',
            maritalStatus: 'Single',
            location: 'Virginia',
            rating: 4.6,
            references: 28,
            companies: 4,
            contacts: 19,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm1.jpeg'
          },
          {
            id: 4,
            name: 'Von Miller 4',
            age: 36,
            gender: 'Male',
            maritalStatus: 'Divorced',
            location: 'Virginia',
            rating: 4.8,
            references: 41,
            companies: 6,
            contacts: 31,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm4.jpg'
          },
          {
            id: 8,
            name: 'Von Miller 8',
            age: 35,
            gender: 'Male',
            maritalStatus: 'Married',
            location: 'Virginia',
            rating: 4.7,
            references: 43,
            companies: 5,
            contacts: 29,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm8.jpg'
          }
        ],
        // Stage 3: 1 result (subset of stage 2)
        [
          {
            id: 4,
            name: 'Von Miller 4',
            age: 36,
            gender: 'Male',
            maritalStatus: 'Divorced',
            location: 'Virginia',
            rating: 4.8,
            references: 41,
            companies: 6,
            contacts: 31,
            image:
              'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm4.jpg'
          }
        ]
      ]
    }
  }

  // Default script for other queries
  return {
    responses: [
      'Default response 1',
      'Default response 2',
      'Default response 3'
    ],
    resultStages: [
      generateScriptedResults('Default Person', 8, 1), // Initial: 8 results
      generateScriptedResults('Default Person', 4, 9), // Stage 1: 4 results
      generateScriptedResults('Default Person', 3, 13), // Stage 2: 3 results
      generateScriptedResults('Default Person', 1, 16) // Stage 3: 1 result
    ]
  }
}

/**
 * Get the next response from a conversation script
 */
export function getNextResponse(
  script: ConversationScript,
  responseIndex: number
): string {
  if (responseIndex >= 0 && responseIndex < script.responses.length) {
    return script.responses[responseIndex] ?? ''
  }

  // If we've exceeded the script length, return the default response
  return "Based on the additional information you provided I have narrowed the list of potential matches. Would you like to provide additional details, or do you see the person you're looking for?"
}

/**
 * Get the scripted results for a specific stage
 */
export function getScriptedResults(
  script: ConversationScript,
  stage: number
): SearchResult[] {
  if (stage >= 0 && stage < script.resultStages.length) {
    return script.resultStages[stage] ?? []
  }

  // If stage is out of bounds, return the last available stage
  return script.resultStages[script.resultStages.length - 1] ?? []
}

/**
 * Get the appropriate detail script based on the search query
 */
export function getDetailScript(query: string): DetailScript {
  const normalizedQuery = query.toLowerCase().trim()

  // Check for John Caruso (case insensitive)
  if (normalizedQuery.includes('john caruso')) {
    return {
      responses: [
        'John Caruso search detail response 1',
        'John Caruso search detail response 2',
        'John Caruso search detail response 3'
      ]
    }
  }

  // Check for Von Miller (case insensitive)
  if (normalizedQuery.includes('von miller')) {
    return {
      responses: [
        'Von Miller search detail response 1',
        'Von Miller search detail response 2',
        'Von Miller search detail response 3'
      ]
    }
  }

  // Default fallback for unknown queries
  return {
    responses: [
      'Search detail response 1',
      'Search detail response 2',
      'Search detail response 3'
    ]
  }
}

/**
 * Get the next response from a detail script
 */
export function getDetailResponse(
  script: DetailScript,
  responseIndex: number
): string {
  if (responseIndex >= 0 && responseIndex < script.responses.length) {
    return script.responses[responseIndex] ?? 'Default search detail response'
  }

  // If we've exceeded the script length, cycle back to the beginning
  return (
    script.responses[responseIndex % script.responses.length] ??
    'Default search detail response'
  )
}
