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
 * Deduplicated person definitions map
 * Key: UUID, Value: SearchResult
 */
const personDefinitions: Record<string, SearchResult> = {
  // John Caruso persons
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d': {
    id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    name: 'John Caruso 1',
    age: 28,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'California',
    rating: 4.2,
    references: 23,
    companies: 3,
    contacts: 18,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc1.webp'
  },
  'b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e': {
    id: 'b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e',
    name: 'John Caruso 2',
    age: 34,
    gender: 'Male',
    maritalStatus: 'Married',
    location: 'California',
    rating: 4.5,
    references: 31,
    companies: 2,
    contacts: 22,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc2.jpg'
  },
  'c3d4e5f6-a7b8-4c7d-0e1f-2a3b4c5d6e7f': {
    id: 'c3d4e5f6-a7b8-4c7d-0e1f-2a3b4c5d6e7f',
    name: 'John Caruso 3',
    age: 31,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'New York',
    rating: 3.8,
    references: 18,
    companies: 4,
    contacts: 14,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc3.jpg'
  },
  'd4e5f6a7-b8c9-4d8e-1f2a-3b4c5d6e7f8a': {
    id: 'd4e5f6a7-b8c9-4d8e-1f2a-3b4c5d6e7f8a',
    name: 'John Caruso 4',
    age: 42,
    gender: 'Male',
    maritalStatus: 'Divorced',
    location: 'California',
    rating: 4.7,
    references: 45,
    companies: 5,
    contacts: 28,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc4.webp'
  },
  'e5f6a7b8-c9d0-4e9f-2a3b-4c5d6e7f8a9b': {
    id: 'e5f6a7b8-c9d0-4e9f-2a3b-4c5d6e7f8a9b',
    name: 'John Caruso 5',
    age: 29,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'Texas',
    rating: 4.0,
    references: 20,
    companies: 3,
    contacts: 16,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc5.jpg'
  },
  'f6a7b8c9-d0e1-4f0a-3b4c-5d6e7f8a9b0c': {
    id: 'f6a7b8c9-d0e1-4f0a-3b4c-5d6e7f8a9b0c',
    name: 'John Caruso 6',
    age: 37,
    gender: 'Male',
    maritalStatus: 'Married',
    location: 'Florida',
    rating: 4.4,
    references: 33,
    companies: 6,
    contacts: 24,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc6.jpeg'
  },
  'a7b8c9d0-e1f2-4a1b-4c5d-6e7f8a9b0c1d': {
    id: 'a7b8c9d0-e1f2-4a1b-4c5d-6e7f8a9b0c1d',
    name: 'John Caruso 7',
    age: 25,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'Illinois',
    rating: 3.9,
    references: 16,
    companies: 2,
    contacts: 12,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc7.jpg'
  },
  'b8c9d0e1-f2a3-4b2c-5d6e-7f8a9b0c1d2e': {
    id: 'b8c9d0e1-f2a3-4b2c-5d6e-7f8a9b0c1d2e',
    name: 'John Caruso 8',
    age: 33,
    gender: 'Male',
    maritalStatus: 'Married',
    location: 'Pennsylvania',
    rating: 4.3,
    references: 28,
    companies: 4,
    contacts: 20,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/jc8.jpg'
  },
  // Von Miller persons
  'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f': {
    id: 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f',
    name: 'Von Miller 1',
    age: 33,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'Virginia',
    rating: 4.6,
    references: 28,
    companies: 4,
    contacts: 19,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm1.jpeg'
  },
  'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a': {
    id: 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a',
    name: 'Von Miller 2',
    age: 29,
    gender: 'Male',
    maritalStatus: 'Married',
    location: 'Virginia',
    rating: 4.3,
    references: 35,
    companies: 3,
    contacts: 24,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm2.jpg'
  },
  'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b': {
    id: 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b',
    name: 'Von Miller 3',
    age: 31,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'Texas',
    rating: 4.0,
    references: 22,
    companies: 5,
    contacts: 16,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm3.jpg'
  },
  'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c': {
    id: 'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c',
    name: 'Von Miller 4',
    age: 36,
    gender: 'Male',
    maritalStatus: 'Divorced',
    location: 'Virginia',
    rating: 4.8,
    references: 41,
    companies: 6,
    contacts: 31,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm4.jpg'
  },
  'a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d': {
    id: 'a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d',
    name: 'Von Miller 5',
    age: 27,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'Ohio',
    rating: 3.7,
    references: 19,
    companies: 3,
    contacts: 13,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm5.jpg'
  },
  'b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e': {
    id: 'b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e',
    name: 'Von Miller 6',
    age: 40,
    gender: 'Male',
    maritalStatus: 'Married',
    location: 'Georgia',
    rating: 4.5,
    references: 37,
    companies: 7,
    contacts: 27,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm6.webp'
  },
  'c5d6e7f8-a9b0-4c1d-2e3f-4a5b6c7d8e9f': {
    id: 'c5d6e7f8-a9b0-4c1d-2e3f-4a5b6c7d8e9f',
    name: 'Von Miller 7',
    age: 32,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'Michigan',
    rating: 4.1,
    references: 25,
    companies: 4,
    contacts: 18,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm7.webp'
  },
  'd6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a': {
    id: 'd6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a',
    name: 'Von Miller 8',
    age: 35,
    gender: 'Male',
    maritalStatus: 'Married',
    location: 'Virginia',
    rating: 4.7,
    references: 43,
    companies: 5,
    contacts: 29,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm8.jpg'
  },
  // Robert Schmidt persons
  'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b': {
    id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
    name: 'Robert Schmidt 1',
    age: 32,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'New York',
    rating: 4.4,
    references: 25,
    companies: 3,
    contacts: 18,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/i1.png'
  },
  'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c': {
    id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
    name: 'Robert Schmidt 2',
    age: 28,
    gender: 'Male',
    maritalStatus: 'Married',
    location: 'California',
    rating: 4.2,
    references: 32,
    companies: 2,
    contacts: 21,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/i2.png'
  },
  'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d': {
    id: 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d',
    name: 'Robert Schmidt 3',
    age: 35,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'Texas',
    rating: 3.9,
    references: 19,
    companies: 4,
    contacts: 14,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/i3.png'
  },
  'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e': {
    id: 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e',
    name: 'Robert Schmidt 4',
    age: 41,
    gender: 'Male',
    maritalStatus: 'Divorced',
    location: 'Florida',
    rating: 4.6,
    references: 38,
    companies: 5,
    contacts: 27,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/i4.png'
  },
  'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3a': {
    id: 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3a',
    name: 'Robert Schmidt 5',
    age: 30,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'Illinois',
    rating: 4.0,
    references: 22,
    companies: 3,
    contacts: 16,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/i5.png'
  },
  'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4b': {
    id: 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4b',
    name: 'Robert Schmidt 6',
    age: 37,
    gender: 'Male',
    maritalStatus: 'Married',
    location: 'Pennsylvania',
    rating: 4.3,
    references: 33,
    companies: 6,
    contacts: 24,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/i6.png'
  },
  'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5c': {
    id: 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5c',
    name: 'Robert Schmidt 7',
    age: 26,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'Ohio',
    rating: 3.8,
    references: 17,
    companies: 2,
    contacts: 12,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/i7.png'
  },
  'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6d': {
    id: 'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6d',
    name: 'Robert Schmidt 8',
    age: 34,
    gender: 'Male',
    maritalStatus: 'Married',
    location: 'Georgia',
    rating: 4.1,
    references: 29,
    companies: 4,
    contacts: 19,
    image: 'https://raw.githubusercontent.com/imcnaney/donkey/main/img/profile.png'
  },
  // Default Example persons
  'a3b4c5d6-e7f8-491a-0b1c-2d3e4f5a6b7c': {
    id: 'a3b4c5d6-e7f8-491a-0b1c-2d3e4f5a6b7c',
    name: 'Example Person 1',
    age: 29,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'California',
    rating: 4.1,
    references: 24,
    companies: 3,
    contacts: 17,
    image: 'https://picsum.photos/240/240?random=501'
  },
  'b4c5d6e7-f8a9-4a2b-1c2d-3e4f5a6b7c8d': {
    id: 'b4c5d6e7-f8a9-4a2b-1c2d-3e4f5a6b7c8d',
    name: 'Example Person 2',
    age: 35,
    gender: 'Male',
    maritalStatus: 'Married',
    location: 'New York',
    rating: 4.3,
    references: 31,
    companies: 4,
    contacts: 22,
    image: 'https://picsum.photos/240/240?random=502'
  },
  'c5d6e7f8-a9b0-4b3c-2d3e-4f5a6b7c8d9e': {
    id: 'c5d6e7f8-a9b0-4b3c-2d3e-4f5a6b7c8d9e',
    name: 'Example Person 3',
    age: 27,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'Texas',
    rating: 3.9,
    references: 18,
    companies: 2,
    contacts: 13,
    image: 'https://picsum.photos/240/240?random=503'
  },
  'd6e7f8a9-b0c1-4c4d-3e4f-5a6b7c8d9e0f': {
    id: 'd6e7f8a9-b0c1-4c4d-3e4f-5a6b7c8d9e0f',
    name: 'Example Person 4',
    age: 42,
    gender: 'Male',
    maritalStatus: 'Divorced',
    location: 'Florida',
    rating: 4.5,
    references: 36,
    companies: 5,
    contacts: 26,
    image: 'https://picsum.photos/240/240?random=504'
  },
  'e7f8a9b0-c1d2-4d5e-4f5a-6b7c8d9e0f1a': {
    id: 'e7f8a9b0-c1d2-4d5e-4f5a-6b7c8d9e0f1a',
    name: 'Example Person 5',
    age: 31,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'Illinois',
    rating: 4.0,
    references: 21,
    companies: 3,
    contacts: 15,
    image: 'https://picsum.photos/240/240?random=505'
  },
  'f8a9b0c1-d2e3-4e6f-5a6b-7c8d9e0f1a2b': {
    id: 'f8a9b0c1-d2e3-4e6f-5a6b-7c8d9e0f1a2b',
    name: 'Example Person 6',
    age: 38,
    gender: 'Male',
    maritalStatus: 'Married',
    location: 'Pennsylvania',
    rating: 4.4,
    references: 34,
    companies: 6,
    contacts: 25,
    image: 'https://picsum.photos/240/240?random=506'
  },
  'a9b0c1d2-e3f4-4f7a-6b7c-8d9e0f1a2b3c': {
    id: 'a9b0c1d2-e3f4-4f7a-6b7c-8d9e0f1a2b3c',
    name: 'Example Person 7',
    age: 25,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'Ohio',
    rating: 3.7,
    references: 16,
    companies: 2,
    contacts: 11,
    image: 'https://picsum.photos/240/240?random=507'
  },
  'b0c1d2e3-f4a5-4a8b-7c8d-9e0f1a2b3c4d': {
    id: 'b0c1d2e3-f4a5-4a8b-7c8d-9e0f1a2b3c4d',
    name: 'Example Person 8',
    age: 33,
    gender: 'Male',
    maritalStatus: 'Married',
    location: 'Georgia',
    rating: 4.2,
    references: 28,
    companies: 4,
    contacts: 20,
    image: 'https://picsum.photos/240/240?random=508'
  }
}

/**
 * Helper function to convert an array of person IDs to an array of SearchResult objects
 */
function getPersonsByIds(ids: string[]): SearchResult[] {
  return ids.map(id => personDefinitions[id]).filter(Boolean) as SearchResult[]
}

/**
 * Get the appropriate conversation script based on the search query
 */
export function getConversationScript(query: string): ConversationScript {
  const normalizedQuery = query.toLowerCase().trim()

  // Check for John Caruso (case insensitive)
  if (normalizedQuery.includes('john caruso')) {
    const jc1 = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'
    const jc2 = 'b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e'
    const jc3 = 'c3d4e5f6-a7b8-4c7d-0e1f-2a3b4c5d6e7f'
    const jc4 = 'd4e5f6a7-b8c9-4d8e-1f2a-3b4c5d6e7f8a'
    const jc5 = 'e5f6a7b8-c9d0-4e9f-2a3b-4c5d6e7f8a9b'
    const jc6 = 'f6a7b8c9-d0e1-4f0a-3b4c-5d6e7f8a9b0c'
    const jc7 = 'a7b8c9d0-e1f2-4a1b-4c5d-6e7f8a9b0c1d'
    const jc8 = 'b8c9d0e1-f2a3-4b2c-5d6e-7f8a9b0c1d2e'

    return {
      responses: [
        'John Caruso response 1',
        'John Caruso response 2',
        'John Caruso response 3'
      ],
      resultStages: [
        getPersonsByIds([jc1, jc2, jc3, jc4, jc5, jc6, jc7, jc8]), // Stage 0: All 8
        getPersonsByIds([jc1, jc2, jc4, jc6]), // Stage 1: 4 persons
        getPersonsByIds([jc1, jc2, jc4]), // Stage 2: 3 persons - JC1 at [0], JC4 at [2]
        getPersonsByIds([jc2]) // Stage 3: 1 person
      ]
    }
  }

  // Check for Von Miller (case insensitive)
  if (normalizedQuery.includes('von miller')) {
    const vm1 = 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f'
    const vm2 = 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a'
    const vm3 = 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b'
    const vm4 = 'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c'
    const vm5 = 'a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d'
    const vm6 = 'b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e'
    const vm7 = 'c5d6e7f8-a9b0-4c1d-2e3f-4a5b6c7d8e9f'
    const vm8 = 'd6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a'

    return {
      responses: [
        'Von Miller response 1',
        'Von Miller response 2',
        'Von Miller response 3'
      ],
      resultStages: [
        getPersonsByIds([vm1, vm2, vm3, vm4, vm5, vm6, vm7, vm8]), // Stage 0: All 8
        getPersonsByIds([vm1, vm2, vm4, vm8]), // Stage 1: 4 persons
        getPersonsByIds([vm2, vm4, vm8]), // Stage 2: 3 persons
        getPersonsByIds([vm4]) // Stage 3: 1 person
      ]
    }
  }

  // Check for Robert Schmidt (case insensitive)
  if (normalizedQuery.includes('robert schmidt')) {
    const rs1 = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b'
    const rs2 = 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c'
    const rs3 = 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d'
    const rs4 = 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e'
    const rs5 = 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3a'
    const rs6 = 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4b'
    const rs7 = 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5c'
    const rs8 = 'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6d'

    return {
      responses: [
        'Robert Schmidt response 1',
        'Robert Schmidt response 2',
        'Robert Schmidt response 3'
      ],
      resultStages: [
        getPersonsByIds([rs1, rs2, rs3, rs4, rs5, rs6, rs7, rs8]), // Stage 0: All 8
        getPersonsByIds([rs1, rs2, rs4, rs8]), // Stage 1: 4 persons
        getPersonsByIds([rs1, rs4, rs8]), // Stage 2: 3 persons
        getPersonsByIds([rs4]) // Stage 3: 1 person
      ]
    }
  }

  // Default script for other queries
  const dp1 = 'a3b4c5d6-e7f8-491a-0b1c-2d3e4f5a6b7c'
  const dp2 = 'b4c5d6e7-f8a9-4a2b-1c2d-3e4f5a6b7c8d'
  const dp3 = 'c5d6e7f8-a9b0-4b3c-2d3e-4f5a6b7c8d9e'
  const dp4 = 'd6e7f8a9-b0c1-4c4d-3e4f-5a6b7c8d9e0f'
  const dp5 = 'e7f8a9b0-c1d2-4d5e-4f5a-6b7c8d9e0f1a'
  const dp6 = 'f8a9b0c1-d2e3-4e6f-5a6b-7c8d9e0f1a2b'
  const dp7 = 'a9b0c1d2-e3f4-4f7a-6b7c-8d9e0f1a2b3c'
  const dp8 = 'b0c1d2e3-f4a5-4a8b-7c8d-9e0f1a2b3c4d'

  return {
    responses: [
      'Default response 1',
      'Default response 2',
      'Default response 3'
    ],
    resultStages: [
      getPersonsByIds([dp1, dp2, dp3, dp4, dp5, dp6, dp7, dp8]), // Stage 0: All 8
      getPersonsByIds([dp1, dp2, dp4, dp6]), // Stage 1: 4 persons
      getPersonsByIds([dp1, dp4, dp6]), // Stage 2: 3 persons
      getPersonsByIds([dp4]) // Stage 3: 1 person
    ]
  }
}

/**
 * Get scripted results for a given stage
 */
export function getScriptedResults(
  script: ConversationScript,
  stage: number
): SearchResult[] {
  const stageIndex = Math.max(
    0,
    Math.min(stage, script.resultStages.length - 1)
  )
  return script.resultStages[stageIndex] ?? []
}

/**
 * Get the next response from a conversation script
 */
export function getNextResponse(
  script: ConversationScript,
  responseIndex: number
): string {
  const defaultResponse =
    "Based on the additional information you provided I have narrowed the list of potential matches. Would you like to provide additional details, or do you see the person you're looking for?"

  if (responseIndex < 0 || script.responses.length === 0) {
    return defaultResponse
  }

  if (responseIndex < script.responses.length) {
    return script.responses[responseIndex] ?? defaultResponse
  }

  // If we've exceeded the script length, return the default response
  return defaultResponse
}

/**
 * Get detail script for a specific person query
 */
export function getDetailScript(query: string): DetailScript {
  const normalizedQuery = query.toLowerCase().trim()

  if (normalizedQuery.includes('john caruso')) {
    return {
      responses: [
        'John Caruso search detail response 1',
        'John Caruso search detail response 2',
        'John Caruso search detail response 3'
      ]
    }
  }

  if (normalizedQuery.includes('von miller')) {
    return {
      responses: [
        'Von Miller search detail response 1',
        'Von Miller search detail response 2',
        'Von Miller search detail response 3'
      ]
    }
  }

  if (normalizedQuery.includes('robert schmidt')) {
    return {
      responses: [
        'Robert Schmidt search detail response 1',
        'Robert Schmidt search detail response 2',
        'Robert Schmidt search detail response 3'
      ]
    }
  }

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
