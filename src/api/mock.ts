export interface SearchResult {
  id: number
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
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
