/**
 * Unit tests for SearchRefinement component
 * Tests different input types, validation, and user interactions
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchRefinement from '../SearchRefinement.vue'
import type { SearchRefinementItem } from '@/types/conversation'

describe('SearchRefinement Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createWrapper = (item: SearchRefinementItem) => {
    return mount(SearchRefinement, {
      props: { item }
    })
  }

  describe('Age Range Input Type', () => {
    const createAgeRangeItem = (
      overrides: Partial<SearchRefinementItem> = {}
    ): SearchRefinementItem => ({
      id: 'age-range-test',
      type: 'refinement',
      label: 'Age Range',
      inputType: 'age-range',
      value: { min: '', max: '' },
      onChange: vi.fn(),
      ...overrides
    })

    it('should render age range inputs correctly', () => {
      const item = createAgeRangeItem()
      const wrapper = createWrapper(item)

      expect(wrapper.find('label').text()).toBe('Age Range')
      expect(wrapper.findAll('input[type="number"]')).toHaveLength(2)
      expect(wrapper.find('input[placeholder="Min age"]').exists()).toBe(true)
      expect(wrapper.find('input[placeholder="Max age"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('to')
    })

    it('should initialize with provided values', () => {
      const item = createAgeRangeItem({
        value: { min: '25', max: '35' }
      })
      const wrapper = createWrapper(item)

      const minInput = wrapper.find('input[placeholder="Min age"]')
      const maxInput = wrapper.find('input[placeholder="Max age"]')

      expect((minInput.element as HTMLInputElement).value).toBe('25')
      expect((maxInput.element as HTMLInputElement).value).toBe('35')
    })

    it('should call onChange when min age changes', async () => {
      const mockOnChange = vi.fn()
      const item = createAgeRangeItem({ onChange: mockOnChange })
      const wrapper = createWrapper(item)

      const minInput = wrapper.find('input[placeholder="Min age"]')
      await minInput.setValue('30')
      await wrapper.vm.$nextTick()

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({ min: 30, max: '' })
      )
    })

    it('should call onChange when max age changes', async () => {
      const mockOnChange = vi.fn()
      const item = createAgeRangeItem({ onChange: mockOnChange })
      const wrapper = createWrapper(item)

      const maxInput = wrapper.find('input[placeholder="Max age"]')
      await maxInput.setValue('40')
      await wrapper.vm.$nextTick()

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({ min: '', max: 40 })
      )
    })

    it('should have proper styling for age range inputs', () => {
      const item = createAgeRangeItem()
      const wrapper = createWrapper(item)

      const inputs = wrapper.findAll('input[type="number"]')
      inputs.forEach(input => {
        expect(input.classes()).toContain('px-3')
        expect(input.classes()).toContain('py-2')
        expect(input.classes()).toContain('border')
        expect(input.classes()).toContain('rounded-md')
        expect(input.classes()).toContain('w-20')
      })
    })
  })

  describe('Text Input Type', () => {
    const createTextItem = (
      overrides: Partial<SearchRefinementItem> = {}
    ): SearchRefinementItem => ({
      id: 'text-test',
      type: 'refinement',
      label: 'Search Query',
      inputType: 'text',
      value: '',
      placeholder: 'Enter search terms',
      onChange: vi.fn(),
      ...overrides
    })

    it('should render text input correctly', () => {
      const item = createTextItem()
      const wrapper = createWrapper(item)

      expect(wrapper.find('label').text()).toBe('Search Query')
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
      expect(wrapper.find('input[type="text"]').attributes('placeholder')).toBe(
        'Enter search terms'
      )
    })

    it('should initialize with provided value', () => {
      const item = createTextItem({ value: 'initial value' })
      const wrapper = createWrapper(item)

      const input = wrapper.find('input[type="text"]')
      expect((input.element as HTMLInputElement).value).toBe('initial value')
    })

    it('should call onChange when text input changes', async () => {
      const mockOnChange = vi.fn()
      const item = createTextItem({ onChange: mockOnChange })
      const wrapper = createWrapper(item)

      const input = wrapper.find('input[type="text"]')
      await input.setValue('new text value')

      expect(mockOnChange).toHaveBeenCalledWith('new text value')
    })

    it('should have proper styling for text input', () => {
      const item = createTextItem()
      const wrapper = createWrapper(item)

      const input = wrapper.find('input[type="text"]')
      expect(input.classes()).toContain('px-3')
      expect(input.classes()).toContain('py-2')
      expect(input.classes()).toContain('border')
      expect(input.classes()).toContain('rounded-md')
      expect(input.classes()).toContain('w-full')
    })
  })

  describe('Select Input Type', () => {
    const createSelectItem = (
      overrides: Partial<SearchRefinementItem> = {}
    ): SearchRefinementItem => ({
      id: 'select-test',
      type: 'refinement',
      label: 'Category',
      inputType: 'select',
      value: '',
      placeholder: 'Choose category',
      options: ['Option 1', 'Option 2', 'Option 3'],
      onChange: vi.fn(),
      ...overrides
    })

    it('should render select input correctly', () => {
      const item = createSelectItem()
      const wrapper = createWrapper(item)

      expect(wrapper.find('label').text()).toBe('Category')
      expect(wrapper.find('select').exists()).toBe(true)
      expect(wrapper.findAll('option')).toHaveLength(4) // placeholder + 3 options
    })

    it('should render options correctly', () => {
      const item = createSelectItem()
      const wrapper = createWrapper(item)

      const options = wrapper.findAll('option')
      expect(options[0]?.text()).toBe('Choose category')
      expect(options[1]?.text()).toBe('Option 1')
      expect(options[2]?.text()).toBe('Option 2')
      expect(options[3]?.text()).toBe('Option 3')
    })

    it('should use default placeholder when none provided', () => {
      const item = createSelectItem({ placeholder: undefined })
      const wrapper = createWrapper(item)

      const firstOption = wrapper.find('option')
      expect(firstOption.text()).toBe('Select an option')
    })

    it('should initialize with provided value', () => {
      const item = createSelectItem({ value: 'Option 2' })
      const wrapper = createWrapper(item)

      const select = wrapper.find('select')
      expect((select.element as HTMLSelectElement).value).toBe('Option 2')
    })

    it('should call onChange when selection changes', async () => {
      const mockOnChange = vi.fn()
      const item = createSelectItem({ onChange: mockOnChange })
      const wrapper = createWrapper(item)

      const select = wrapper.find('select')
      await select.setValue('Option 2')

      expect(mockOnChange).toHaveBeenCalledWith('Option 2')
    })

    it('should have proper styling for select input', () => {
      const item = createSelectItem()
      const wrapper = createWrapper(item)

      const select = wrapper.find('select')
      expect(select.classes()).toContain('px-3')
      expect(select.classes()).toContain('py-2')
      expect(select.classes()).toContain('border')
      expect(select.classes()).toContain('rounded-md')
      expect(select.classes()).toContain('w-full')
    })
  })

  describe('Checkbox Input Type', () => {
    const createCheckboxItem = (
      overrides: Partial<SearchRefinementItem> = {}
    ): SearchRefinementItem => ({
      id: 'checkbox-test',
      type: 'refinement',
      label: 'Options',
      inputType: 'checkbox',
      value: false,
      placeholder: 'Enable this option',
      onChange: vi.fn(),
      ...overrides
    })

    it('should render checkbox input correctly', () => {
      const item = createCheckboxItem()
      const wrapper = createWrapper(item)

      expect(wrapper.find('label').text()).toContain('Options')
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Enable this option')
    })

    it('should initialize with provided value', () => {
      const item = createCheckboxItem({ value: true })
      const wrapper = createWrapper(item)

      const checkbox = wrapper.find('input[type="checkbox"]')
      expect((checkbox.element as HTMLInputElement).checked).toBe(true)
    })

    it('should call onChange when checkbox changes', async () => {
      const mockOnChange = vi.fn()
      const item = createCheckboxItem({ onChange: mockOnChange })
      const wrapper = createWrapper(item)

      const checkbox = wrapper.find('input[type="checkbox"]')
      await checkbox.setValue(true)

      expect(mockOnChange).toHaveBeenCalledWith(true)
    })

    it('should have proper styling for checkbox', () => {
      const item = createCheckboxItem()
      const wrapper = createWrapper(item)

      const label = wrapper.find('label.flex')
      expect(label.classes()).toContain('items-center')
      expect(label.classes()).toContain('gap-2')
      expect(label.classes()).toContain('cursor-pointer')

      const checkbox = wrapper.find('input[type="checkbox"]')
      expect(checkbox.classes()).toContain('rounded')
    })
  })

  describe('Value Watching and Updates', () => {
    it('should update local value when prop value changes for age range', async () => {
      const item: SearchRefinementItem = {
        id: 'watch-test',
        type: 'refinement',
        label: 'Test',
        inputType: 'age-range',
        value: { min: '20', max: '30' },
        onChange: vi.fn()
      }

      const wrapper = createWrapper(item)

      // Change prop value
      await wrapper.setProps({
        item: { ...item, value: { min: '25', max: '35' } }
      })

      // Verify that the inputs show the updated values
      const minInput = wrapper.find('input[placeholder="Min age"]')
      const maxInput = wrapper.find('input[placeholder="Max age"]')
      expect((minInput.element as HTMLInputElement).value).toBe('25')
      expect((maxInput.element as HTMLInputElement).value).toBe('35')
    })

    it('should update local value when prop value changes for text', async () => {
      const item: SearchRefinementItem = {
        id: 'watch-test',
        type: 'refinement',
        label: 'Test',
        inputType: 'text',
        value: 'initial',
        onChange: vi.fn()
      }

      const wrapper = createWrapper(item)

      // Change prop value
      await wrapper.setProps({
        item: { ...item, value: 'updated' }
      })

      // Verify that the input shows the updated value
      const textInput = wrapper.find('input[type="text"]')
      expect((textInput.element as HTMLInputElement).value).toBe('updated')
    })

    it('should handle null/undefined values gracefully', async () => {
      const item: SearchRefinementItem = {
        id: 'null-test',
        type: 'refinement',
        label: 'Test',
        inputType: 'age-range',
        value: undefined,
        onChange: vi.fn()
      }

      const wrapper = createWrapper(item)
      // Verify that age range inputs default to empty
      const minInput = wrapper.find('input[placeholder="Min age"]')
      const maxInput = wrapper.find('input[placeholder="Max age"]')
      expect((minInput.element as HTMLInputElement).value).toBe('')
      expect((maxInput.element as HTMLInputElement).value).toBe('')
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should not call onChange when onChange is undefined', async () => {
      const item: SearchRefinementItem = {
        id: 'no-callback-test',
        type: 'refinement',
        label: 'Test',
        inputType: 'text',
        value: '',
        onChange: undefined
      }

      const wrapper = createWrapper(item)

      // Should not throw error when onChange is undefined
      const input = wrapper.find('input[type="text"]')
      await input.setValue('test value')

      expect(wrapper.exists()).toBe(true)
    })

    it('should handle missing options for select input', () => {
      const item: SearchRefinementItem = {
        id: 'no-options-test',
        type: 'refinement',
        label: 'Test',
        inputType: 'select',
        value: '',
        onChange: vi.fn()
      }

      const wrapper = createWrapper(item)

      // Should render select with just placeholder option
      expect(wrapper.findAll('option')).toHaveLength(1)
    })

    it('should handle empty options array for select input', () => {
      const item: SearchRefinementItem = {
        id: 'empty-options-test',
        type: 'refinement',
        label: 'Test',
        inputType: 'select',
        value: '',
        options: [],
        onChange: vi.fn()
      }

      const wrapper = createWrapper(item)

      // Should render select with just placeholder option
      expect(wrapper.findAll('option')).toHaveLength(1)
    })
  })

  describe('Accessibility', () => {
    it('should have proper label structure', () => {
      const item: SearchRefinementItem = {
        id: 'a11y-test',
        type: 'refinement',
        label: 'Accessible Label',
        inputType: 'text',
        value: '',
        onChange: vi.fn()
      }

      const wrapper = createWrapper(item)

      const label = wrapper.find('label')
      expect(label.exists()).toBe(true)
      expect(label.classes()).toContain('block')
      expect(label.classes()).toContain('text-sm')
      expect(label.classes()).toContain('font-medium')
    })

    it('should have proper form control styling', () => {
      const item: SearchRefinementItem = {
        id: 'styling-test',
        type: 'refinement',
        label: 'Test',
        inputType: 'text',
        value: '',
        onChange: vi.fn()
      }

      const wrapper = createWrapper(item)

      const input = wrapper.find('input')
      expect(input.classes()).toContain('border')
      expect(input.classes()).toContain('border-border-light')
      expect(input.classes()).toContain('rounded-md')
    })

    it('should support keyboard navigation for checkbox', () => {
      const item: SearchRefinementItem = {
        id: 'keyboard-test',
        type: 'refinement',
        label: 'Test',
        inputType: 'checkbox',
        value: '',
        placeholder: 'Check this option',
        onChange: vi.fn()
      }

      const wrapper = createWrapper(item)

      const checkbox = wrapper.find('input[type="checkbox"]')
      expect(checkbox.attributes('tabindex')).not.toBe('-1')
    })
  })
})
