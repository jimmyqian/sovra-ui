export interface SearchResult {
  id: string
  name: string
  age: number
  gender: string
  maritalStatus: string
  location: string
  rating: number
  references: number
  companies: number
  contacts: number
  image?: string
}

export interface SearchResponse {
  query: string
  results: SearchResult[]
  totalCount: number
}

const mockResults: SearchResult[] = [
  {
    id: 'f0a1b2c3-d4e5-4f6a-7b8c-9d0e1f2a3b4c',
    name: 'Johnson Smith',
    age: 26,
    gender: 'Male',
    maritalStatus: 'Married',
    location: 'California',
    rating: 3.2,
    references: 26,
    companies: 10,
    contacts: 7,
    image: 'https://picsum.photos/240/240?random=101'
  },
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    name: 'Johnson Brown',
    age: 28,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'California',
    rating: 4.1,
    references: 34,
    companies: 8,
    contacts: 12,
    image: 'https://picsum.photos/240/240?random=102'
  },
  {
    id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    name: 'Johnson Davis',
    age: 25,
    gender: 'Male',
    maritalStatus: 'Married',
    location: 'California',
    rating: 2.8,
    references: 18,
    companies: 5,
    contacts: 3,
    image: 'https://picsum.photos/240/240?random=103'
  },
  {
    id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
    name: 'Johnson Wilson',
    age: 29,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'California',
    rating: 3.7,
    references: 42,
    companies: 15,
    contacts: 9,
    image: 'https://picsum.photos/240/240?random=104'
  },
  {
    id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
    name: 'Johnson Miller',
    age: 24,
    gender: 'Male',
    maritalStatus: 'Single',
    location: 'California',
    rating: 4.2,
    references: 31,
    companies: 12,
    contacts: 8,
    image: 'https://picsum.photos/240/240?random=105'
  }
]

export const searchPeople = async (query: string): Promise<SearchResponse> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        query,
        results: mockResults,
        totalCount: 56
      })
    }, 1000)
  })
}

export const uploadFile = async (
  file: File
): Promise<{ success: boolean; message: string }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `File "${file.name}" uploaded successfully`
      })
    }, 500)
  })
}
