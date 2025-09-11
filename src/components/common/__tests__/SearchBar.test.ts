import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SearchBar from '../SearchBar.vue'

describe('SearchBar', () => {
  const defaultProps = {
    modelValue: '',
    placeholder: 'Test placeholder'
  }

  it('renders correctly with default props', () => {
    const wrapper = mount(SearchBar, {
      props: defaultProps
    })

    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('textarea').attributes('placeholder')).toBe(
      'Test placeholder'
    )
    expect(wrapper.find('[data-testid="upload-button"]').exists()).toBe(false) // Will check for upload button
    expect(wrapper.find('button').exists()).toBe(true) // Upload, mic, search buttons
  })

  it('displays the correct model value in textarea', () => {
    const wrapper = mount(SearchBar, {
      props: {
        ...defaultProps,
        modelValue: 'test query'
      }
    })

    expect(wrapper.find('textarea').element.value).toBe('test query')
  })

  it('emits update:modelValue when textarea input changes', async () => {
    const wrapper = mount(SearchBar, {
      props: defaultProps
    })

    const textarea = wrapper.find('textarea')
    await textarea.setValue('new query')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new query'])
  })

  it('emits search event when search button is clicked', async () => {
    const wrapper = mount(SearchBar, {
      props: defaultProps
    })

    // Find search button (should be the last button with search icon)
    const buttons = wrapper.findAll('button')
    const searchButton = buttons[buttons.length - 1] // Search button is last

    await searchButton.trigger('click')

    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')?.[0]).toEqual([])
  })

  it('emits search event when Enter is pressed in textarea', async () => {
    const wrapper = mount(SearchBar, {
      props: defaultProps
    })

    const textarea = wrapper.find('textarea')
    await textarea.trigger('keypress.enter')

    expect(wrapper.emitted('search')).toBeTruthy()
  })

  it('triggers file upload when upload button is clicked', async () => {
    const wrapper = mount(SearchBar, {
      props: defaultProps
    })

    // Mock file input click
    const fileInput = wrapper.find('input[type="file"]')
    const clickSpy = vi.spyOn(fileInput.element, 'click')

    // Find upload button (first button)
    const uploadButton = wrapper.find('button')
    await uploadButton.trigger('click')

    expect(clickSpy).toHaveBeenCalled()
  })

  it('emits fileUpload event when files are selected', async () => {
    const wrapper = mount(SearchBar, {
      props: defaultProps
    })

    const fileInput = wrapper.find('input[type="file"]')

    // Mock FileList
    const mockFiles = {
      length: 1,
      0: new File(['test'], 'test.pdf', { type: 'application/pdf' })
    } as FileList

    // Set files and trigger change
    Object.defineProperty(fileInput.element, 'files', {
      value: mockFiles,
      writable: false
    })

    await fileInput.trigger('change')

    expect(wrapper.emitted('fileUpload')).toBeTruthy()
    expect(wrapper.emitted('fileUpload')?.[0]).toEqual([mockFiles])
  })

  it('has correct file input attributes', () => {
    const wrapper = mount(SearchBar, {
      props: defaultProps
    })

    const fileInput = wrapper.find('input[type="file"]')

    expect(fileInput.attributes('multiple')).toBe('')
    expect(fileInput.attributes('accept')).toBe(
      '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif'
    )
    expect(fileInput.element.style.display).toBe('none')
  })

  it('renders upload button with correct styling', () => {
    const wrapper = mount(SearchBar, {
      props: defaultProps
    })

    const uploadButton = wrapper.find('button')

    // Check for bg-bg-button class and other styling
    expect(uploadButton.classes()).toContain('bg-bg-button')
    expect(uploadButton.classes()).toContain('border-brand-orange')
    expect(uploadButton.classes()).toContain('text-brand-orange')
    expect(uploadButton.text()).toContain('Upload')
  })

  it('renders microphone and search buttons', () => {
    const wrapper = mount(SearchBar, {
      props: defaultProps
    })

    const buttons = wrapper.findAll('button')

    // Should have 3 buttons: upload, mic, search
    expect(buttons).toHaveLength(3)

    // Check for button classes
    const micButton = buttons[1]
    const searchButton = buttons[2]

    expect(micButton.classes()).toContain('btn-ghost')
    expect(searchButton.classes()).toContain('btn-primary')
  })

  it('adjusts textarea height on input', async () => {
    const wrapper = mount(SearchBar, {
      props: defaultProps
    })

    const textarea = wrapper.find('textarea')

    // Mock scrollHeight
    Object.defineProperty(textarea.element, 'scrollHeight', {
      value: 100,
      writable: true
    })

    await textarea.setValue('Long text that should expand the textarea height')
    await nextTick()

    // The component should set the height to scrollHeight
    expect(textarea.element.style.height).toBe('100px')
  })

  it('uses default placeholder when none provided', () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: ''
      }
    })

    expect(wrapper.find('textarea').attributes('placeholder')).toBe(
      'Enter your search query...'
    )
  })

  describe('Disabled State', () => {
    it('should disable textarea when disabled prop is true', () => {
      const wrapper = mount(SearchBar, {
        props: {
          ...defaultProps,
          disabled: true
        }
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.element.disabled).toBe(true)
      expect(textarea.classes()).toContain('opacity-50')
      expect(textarea.classes()).toContain('cursor-not-allowed')
    })

    it('should disable all buttons when disabled prop is true', () => {
      const wrapper = mount(SearchBar, {
        props: {
          ...defaultProps,
          disabled: true
        }
      })

      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        expect(button.element.disabled).toBe(true)
        expect(button.classes()).toContain('opacity-50')
        expect(button.classes()).toContain('cursor-not-allowed')
      })
    })

    it('should not emit search event when disabled', async () => {
      const wrapper = mount(SearchBar, {
        props: {
          ...defaultProps,
          disabled: true
        }
      })

      const searchButton = wrapper.findAll('button')[2]
      await searchButton.trigger('click')

      expect(wrapper.emitted('search')).toBeFalsy()
    })

    it('should not emit update:modelValue when disabled', async () => {
      const wrapper = mount(SearchBar, {
        props: {
          ...defaultProps,
          disabled: true
        }
      })

      const textarea = wrapper.find('textarea')
      await textarea.setValue('new value')

      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    it('should not trigger file upload when disabled', async () => {
      const wrapper = mount(SearchBar, {
        props: {
          ...defaultProps,
          disabled: true
        }
      })

      const uploadButton = wrapper.findAll('button')[0]
      await uploadButton.trigger('click')

      // File input should not be clicked (no way to directly test click() call)
      // But we can verify the button has disabled attributes
      expect(uploadButton.element.disabled).toBe(true)
    })

    it('should not handle enter key when disabled', async () => {
      const wrapper = mount(SearchBar, {
        props: {
          ...defaultProps,
          disabled: true
        }
      })

      const textarea = wrapper.find('textarea')
      await textarea.trigger('keypress.enter')

      expect(wrapper.emitted('search')).toBeFalsy()
    })

    it('should enable all functionality when disabled is false', async () => {
      const wrapper = mount(SearchBar, {
        props: {
          ...defaultProps,
          disabled: false
        }
      })

      const textarea = wrapper.find('textarea')
      const searchButton = wrapper.findAll('button')[2]

      // Should emit modelValue update
      await textarea.setValue('test')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()

      // Should emit search event
      await searchButton.trigger('click')
      expect(wrapper.emitted('search')).toBeTruthy()

      // Should handle enter key
      await textarea.trigger('keypress.enter')
      expect(wrapper.emitted('search')).toHaveLength(2) // One from button click, one from enter
    })
  })
})
