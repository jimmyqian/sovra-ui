/**
 * Type definitions for search conversation components
 * Defines the structure for dynamic conversation items in search results
 */

export interface BaseConversationItem {
  id: string
  type: string
}

export interface TextParagraphItem extends BaseConversationItem {
  type: 'text'
  content: string
  emphasis?: 'normal' | 'strong' | 'secondary'
  className?: string
}

export interface SearchHintItem extends BaseConversationItem {
  type: 'hint'
  text: string
  onClick?: () => void
  className?: string
}

export interface SearchHintsGroupItem extends BaseConversationItem {
  type: 'hints-group'
  hints: Omit<SearchHintItem, 'id' | 'type'>[]
}

export interface ResultsSummaryItem extends BaseConversationItem {
  type: 'results-summary'
  resultCount: number
  searchTerm?: string
  template?: string
}

export interface SearchRefinementItem extends BaseConversationItem {
  type: 'refinement'
  label: string
  inputType: 'age-range' | 'text' | 'select' | 'checkbox'
  placeholder?: string
  options?: string[]
  value?: string | { min: string; max: string } | string[] | boolean
  onChange?: (
    value: string | { min: string; max: string } | string[] | boolean
  ) => void
}

export interface ActionButtonItem extends BaseConversationItem {
  type: 'action-button'
  text: string
  variant?: 'primary' | 'secondary' | 'dashed'
  onClick?: () => void
  className?: string
}

export interface FileUploadItem extends BaseConversationItem {
  type: 'file-upload'
  label: string
  acceptedTypes?: string[]
  onUpload?: (files: FileList) => void
}

export type ConversationItem =
  | TextParagraphItem
  | SearchHintItem
  | SearchHintsGroupItem
  | ResultsSummaryItem
  | SearchRefinementItem
  | ActionButtonItem
  | FileUploadItem

export interface ConversationMessage {
  id: string
  sender: 'user' | 'system'
  timestamp?: Date
  content?: string // For user messages
  items?: ConversationItem[] // For system messages
}

export interface SearchConversationProps {
  messages: ConversationMessage[]
  userQuery?: string
}
