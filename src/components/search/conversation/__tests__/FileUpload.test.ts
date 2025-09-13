/**
 * Unit tests for FileUpload component
 * Tests file upload functionality, accepted types, and user interactions
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FileUpload from '../FileUpload.vue'
import type { FileUploadItem } from '@/types/conversation'

describe('FileUpload Component', () => {
  const createMockItem = (
    overrides: Partial<FileUploadItem> = {}
  ): FileUploadItem => ({
    id: 'test-upload',
    type: 'file-upload',
    label: 'Upload Documents',
    acceptedTypes: ['.pdf', '.doc', '.jpg'],
    onUpload: vi.fn(),
    ...overrides
  })

  const createWrapper = (item: FileUploadItem) => {
    return mount(FileUpload, {
      props: { item }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render file upload interface correctly', () => {
      const item = createMockItem()
      const wrapper = createWrapper(item)

      expect(wrapper.find('label').text()).toBe('Upload Documents')
      expect(wrapper.find('button').text()).toContain('Click to upload files')
      expect(wrapper.find('input[type="file"]').exists()).toBe(true)
    })

    it('should display accepted file types', () => {
      const item = createMockItem({
        acceptedTypes: ['.pdf', '.doc', '.jpg', '.png']
      })
      const wrapper = createWrapper(item)

      expect(wrapper.text()).toContain('.pdf, .doc, .jpg, .png')
    })

    it('should show default text when no accepted types specified', () => {
      const item = createMockItem({ acceptedTypes: undefined })
      const wrapper = createWrapper(item)

      expect(wrapper.text()).toContain('All file types accepted')
    })

    it('should have proper styling classes', () => {
      const item = createMockItem()
      const wrapper = createWrapper(item)

      expect(wrapper.find('.border-dashed').exists()).toBe(true)
      expect(wrapper.find('.hover\\:border-brand-orange').exists()).toBe(true)
      expect(wrapper.find('.text-brand-orange').exists()).toBe(true)
    })
  })

  describe('File Input Configuration', () => {
    it('should configure file input with correct attributes', () => {
      const item = createMockItem({
        acceptedTypes: ['.pdf', '.docx', '.jpg']
      })
      const wrapper = createWrapper(item)
      const fileInput = wrapper.find('input[type="file"]')

      expect(fileInput.attributes('multiple')).toBeDefined()
      expect(fileInput.attributes('accept')).toBe('.pdf,.docx,.jpg')
      expect(fileInput.attributes('class')).toContain('hidden')
    })

    it('should handle empty accepted types', () => {
      const item = createMockItem({ acceptedTypes: [] })
      const wrapper = createWrapper(item)
      const fileInput = wrapper.find('input[type="file"]')

      expect(fileInput.attributes('accept')).toBe('')
    })

    it('should handle undefined accepted types', () => {
      const item = createMockItem({ acceptedTypes: undefined })
      const wrapper = createWrapper(item)
      const fileInput = wrapper.find('input[type="file"]')

      expect(fileInput.attributes('accept')).toBe('')
    })
  })

  describe('User Interactions', () => {
    it('should trigger file input when button is clicked', async () => {
      const item = createMockItem()
      const wrapper = createWrapper(item)

      const fileInput = wrapper.find('input[type="file"]')
      const button = wrapper.find('button')

      // Mock the click method
      const clickSpy = vi.spyOn(fileInput.element as HTMLInputElement, 'click')
      clickSpy.mockImplementation(() => {})

      await button.trigger('click')

      expect(clickSpy).toHaveBeenCalled()
    })

    it('should call onUpload when files are selected', async () => {
      const mockOnUpload = vi.fn()
      const item = createMockItem({ onUpload: mockOnUpload })
      const wrapper = createWrapper(item)

      const fileInput = wrapper.find('input[type="file"]')
      const mockFiles = [
        new File(['content'], 'test1.pdf', { type: 'application/pdf' }),
        new File(['content'], 'test2.jpg', { type: 'image/jpeg' })
      ] as File[]

      // Mock FileList
      const mockFileList = {
        0: mockFiles[0],
        1: mockFiles[1],
        length: mockFiles.length,
        item: (index: number) => mockFiles[index] ?? null,
        *[Symbol.iterator]() {
          for (let i = 0; i < mockFiles.length; i++) {
            yield mockFiles[i]
          }
        }
      } as unknown as FileList

      Object.defineProperty(fileInput.element, 'files', {
        value: mockFileList,
        writable: false
      })

      await fileInput.trigger('change')

      expect(mockOnUpload).toHaveBeenCalledWith(mockFileList)
    })

    it('should not call onUpload when no files are selected', async () => {
      const mockOnUpload = vi.fn()
      const item = createMockItem({ onUpload: mockOnUpload })
      const wrapper = createWrapper(item)

      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', {
        value: null,
        writable: false
      })

      await fileInput.trigger('change')

      expect(mockOnUpload).not.toHaveBeenCalled()
    })

    it('should not call onUpload when onUpload is undefined', async () => {
      const item = createMockItem({ onUpload: undefined })
      const wrapper = createWrapper(item)

      const fileInput = wrapper.find('input[type="file"]')
      const mockFiles = [new File(['content'], 'test.pdf')] as File[]

      const mockFileList = {
        0: mockFiles[0],
        length: 1,
        item: () => mockFiles[0],
        *[Symbol.iterator]() {
          yield mockFiles[0]
        }
      } as unknown as FileList

      Object.defineProperty(fileInput.element, 'files', {
        value: mockFileList,
        writable: false
      })

      // Should not throw error when onUpload is undefined
      await fileInput.trigger('change')

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Computed Properties', () => {
    it('should configure file input accept attribute correctly', () => {
      const item = createMockItem({
        acceptedTypes: ['.pdf', '.doc', '.jpg']
      })
      const wrapper = createWrapper(item)
      const fileInput = wrapper.find('input[type="file"]')

      expect(fileInput.attributes('accept')).toBe('.pdf,.doc,.jpg')
    })

    it('should display accepted types correctly', () => {
      const item = createMockItem({
        acceptedTypes: ['.pdf', '.doc', '.jpg']
      })
      const wrapper = createWrapper(item)

      expect(wrapper.text()).toContain('.pdf, .doc, .jpg')
    })

    it('should handle empty accepted types in display', () => {
      const item = createMockItem({ acceptedTypes: [] })
      const wrapper = createWrapper(item)
      const fileInput = wrapper.find('input[type="file"]')

      expect(fileInput.attributes('accept')).toBe('')
      expect(wrapper.text()).toContain('All file types accepted')
    })
  })

  describe('Props Validation', () => {
    it('should accept valid item prop', () => {
      const item = createMockItem()
      const wrapper = createWrapper(item)

      expect(wrapper.props('item')).toEqual(item)
    })

    it('should display custom label', () => {
      const item = createMockItem({
        label: 'Upload Profile Pictures'
      })
      const wrapper = createWrapper(item)

      expect(wrapper.find('label').text()).toBe('Upload Profile Pictures')
    })

    it('should work with different accepted types', () => {
      const item = createMockItem({
        acceptedTypes: ['.png', '.gif', '.webp']
      })
      const wrapper = createWrapper(item)

      expect(wrapper.text()).toContain('.png, .gif, .webp')
    })
  })

  describe('Accessibility', () => {
    it('should have proper label association', () => {
      const item = createMockItem()
      const wrapper = createWrapper(item)

      const label = wrapper.find('label')
      expect(label.exists()).toBe(true)
      expect(label.classes()).toContain('block')
      expect(label.classes()).toContain('text-sm')
      expect(label.classes()).toContain('font-medium')
    })

    it('should have descriptive helper text', () => {
      const item = createMockItem()
      const wrapper = createWrapper(item)

      const helperText = wrapper.find('.text-xs.text-text-muted')
      expect(helperText.exists()).toBe(true)
      expect(helperText.text()).toContain('.pdf, .doc, .jpg')
    })

    it('should have clickable button text', () => {
      const item = createMockItem()
      const wrapper = createWrapper(item)

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.text()).toContain('Click to upload files or drag and drop')
    })

    it('should have keyboard accessible button', () => {
      const item = createMockItem()
      const wrapper = createWrapper(item)

      const button = wrapper.find('button')
      expect(button.attributes('tabindex')).not.toBe('-1')
    })
  })

  describe('Visual States', () => {
    it('should have hover state styling', () => {
      const item = createMockItem()
      const wrapper = createWrapper(item)

      const dropZone = wrapper.find('.border-dashed')
      expect(dropZone.classes()).toContain('hover:border-brand-orange')
      expect(dropZone.classes()).toContain('transition-colors')
    })

    it('should style upload button correctly', () => {
      const item = createMockItem()
      const wrapper = createWrapper(item)

      const button = wrapper.find('button')
      expect(button.classes()).toContain('text-brand-orange')
      expect(button.classes()).toContain('hover:text-brand-orange-light')
      expect(button.classes()).toContain('cursor-pointer')
    })
  })
})
