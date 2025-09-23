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

export interface FilterItem {
  id: string
  text: string
  removable?: boolean
  hasDropdown?: boolean
  dropdownText?: string
}
