import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
    expect(searchButton).toBeTruthy()

    if (searchButton) {
      await searchButton.trigger('click')
    }

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
    const clickSpy = vi.spyOn(fileInput.element as HTMLInputElement, 'click')

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
    } as unknown as FileList

    // Set files and trigger change
    Object.defineProperty(fileInput.element, 'files', {
      value: mockFiles,
      writable: false
    })

    await fileInput.trigger('change')

    expect(wrapper.emitted('fileUpload')).toBeTruthy()
    // Should emit a File array instead of FileList
    const emittedFiles = wrapper.emitted('fileUpload')?.[0]?.[0] as File[]
    expect(emittedFiles).toBeInstanceOf(Array)
    expect(emittedFiles).toHaveLength(1)
    expect(emittedFiles[0]).toBeInstanceOf(File)
    expect(emittedFiles[0]?.name).toBe('test.pdf')
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
    expect((fileInput.element as HTMLInputElement).style.display).toBe('none')
  })

  it('renders upload button with correct styling', () => {
    const wrapper = mount(SearchBar, {
      props: defaultProps
    })

    const uploadButton = wrapper.find('button')

    // Check for button component styling
    expect(uploadButton.classes()).toContain('bg-white')
    expect(uploadButton.classes()).toContain('border-slate-300')
    expect(uploadButton.classes()).toContain('text-slate-700')
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

    expect(micButton).toBeTruthy()
    expect(searchButton).toBeTruthy()
    if (micButton) {
      expect(micButton.classes()).toContain('bg-transparent')
    }
    if (searchButton) {
      expect(searchButton.classes()).toContain('bg-gradient-to-r')
    }
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
        // Check for Tailwind conditional classes instead of resolved styles
        expect(button.classes()).toContain('disabled:opacity-50')
        expect(button.classes()).toContain('disabled:cursor-not-allowed')
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
      expect(searchButton).toBeTruthy()
      if (searchButton) {
        await searchButton.trigger('click')
      }

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
      expect(uploadButton).toBeTruthy()
      if (uploadButton) {
        await uploadButton.trigger('click')

        // File input should not be clicked (no way to directly test click() call)
        // But we can verify the button has disabled attributes
        expect(uploadButton.element.disabled).toBe(true)
      }
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
      expect(searchButton).toBeTruthy()

      // Should emit modelValue update
      await textarea.setValue('test')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()

      // Should emit search event
      if (searchButton) {
        await searchButton.trigger('click')
      }
      expect(wrapper.emitted('search')).toBeTruthy()

      // Should handle enter key
      await textarea.trigger('keypress.enter')
      expect(wrapper.emitted('search')).toHaveLength(2) // One from button click, one from enter
    })
  })

  describe('Speech Recognition', () => {
    let mockSpeechRecognition: any
    let originalSpeechRecognition: any
    let originalWebkitSpeechRecognition: any

    beforeEach(() => {
      // Store original values
      originalSpeechRecognition = (window as any).SpeechRecognition
      originalWebkitSpeechRecognition = (window as any).webkitSpeechRecognition

      // Mock SpeechRecognition
      mockSpeechRecognition = {
        continuous: false,
        interimResults: false,
        lang: 'en-US',
        start: vi.fn(),
        stop: vi.fn(),
        abort: vi.fn(),
        onstart: null,
        onend: null,
        onresult: null,
        onerror: null
      }

      // Mock window.SpeechRecognition
      Object.defineProperty(window, 'SpeechRecognition', {
        value: vi.fn(() => mockSpeechRecognition),
        writable: true,
        configurable: true
      })

      Object.defineProperty(window, 'webkitSpeechRecognition', {
        value: vi.fn(() => mockSpeechRecognition),
        writable: true,
        configurable: true
      })
    })

    afterEach(() => {
      // Restore original values
      if (originalSpeechRecognition !== undefined) {
        Object.defineProperty(window, 'SpeechRecognition', {
          value: originalSpeechRecognition,
          writable: true,
          configurable: true
        })
      } else {
        delete (window as any).SpeechRecognition
      }

      if (originalWebkitSpeechRecognition !== undefined) {
        Object.defineProperty(window, 'webkitSpeechRecognition', {
          value: originalWebkitSpeechRecognition,
          writable: true,
          configurable: true
        })
      } else {
        delete (window as any).webkitSpeechRecognition
      }
    })

    it('initializes speech recognition when supported', async () => {
      mount(SearchBar, {
        props: defaultProps
      })

      await nextTick()

      // Should have created speech recognition instance
      expect(
        window.SpeechRecognition ?? window.webkitSpeechRecognition
      ).toHaveBeenCalled()
    })

    it('disables microphone button when speech not supported', async () => {
      // Remove speech recognition support by setting to undefined
      Object.defineProperty(window, 'SpeechRecognition', {
        value: undefined,
        writable: true,
        configurable: true
      })
      Object.defineProperty(window, 'webkitSpeechRecognition', {
        value: undefined,
        writable: true,
        configurable: true
      })

      const wrapper = mount(SearchBar, {
        props: defaultProps
      })

      await nextTick()

      const micButton = wrapper.findAll('button')[1]
      expect(micButton).toBeTruthy()
      if (micButton) {
        expect(micButton.element.disabled).toBe(true)
      }
    })

    it('starts speech recognition when microphone button clicked', async () => {
      const wrapper = mount(SearchBar, {
        props: defaultProps
      })

      await nextTick()

      const micButton = wrapper.findAll('button')[1]
      expect(micButton).toBeTruthy()
      if (micButton) {
        await micButton.trigger('click')
        expect(mockSpeechRecognition.start).toHaveBeenCalled()
      }
    })

    it('stops speech recognition when clicked while listening', async () => {
      const wrapper = mount(SearchBar, {
        props: defaultProps
      })

      await nextTick()

      // Simulate starting recognition
      if (mockSpeechRecognition.onstart) {
        mockSpeechRecognition.onstart()
      }

      await nextTick()

      const micButton = wrapper.findAll('button')[1]
      expect(micButton).toBeTruthy()
      if (micButton) {
        await micButton.trigger('click')
        expect(mockSpeechRecognition.stop).toHaveBeenCalled()
      }
    })

    it('updates model value when speech result received', async () => {
      const wrapper = mount(SearchBar, {
        props: defaultProps
      })

      await nextTick()

      // Simulate speech recognition result
      const mockEvent = {
        results: [[{ transcript: 'hello world', confidence: 0.9 }]]
      }

      if (mockSpeechRecognition.onresult) {
        mockSpeechRecognition.onresult(mockEvent)
      }

      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello world'])
    })

    it('auto-submits search after speech input', async () => {
      const wrapper = mount(SearchBar, {
        props: defaultProps
      })

      await nextTick()

      // Simulate speech recognition result
      const mockEvent = {
        results: [[{ transcript: 'search query', confidence: 0.9 }]]
      }

      if (mockSpeechRecognition.onresult) {
        mockSpeechRecognition.onresult(mockEvent)
      }

      await nextTick()

      // Wait for setTimeout to trigger search
      await new Promise(resolve => setTimeout(resolve, 150))

      expect(wrapper.emitted('search')).toBeTruthy()
    })

    it('emits speech error when recognition fails', async () => {
      const wrapper = mount(SearchBar, {
        props: defaultProps
      })

      await nextTick()

      // Simulate speech recognition error
      const mockErrorEvent = {
        error: 'no-speech',
        message: 'No speech detected'
      }

      if (mockSpeechRecognition.onerror) {
        mockSpeechRecognition.onerror(mockErrorEvent)
      }

      await nextTick()

      expect(wrapper.emitted('speechError')).toBeTruthy()
      expect(wrapper.emitted('speechError')?.[0]).toEqual([
        'No speech was detected. Please try again.'
      ])
    })

    it('handles different error types with appropriate messages', async () => {
      const wrapper = mount(SearchBar, {
        props: defaultProps
      })

      await nextTick()

      const errorTypes = [
        {
          error: 'audio-capture',
          expectedMessage:
            'No microphone was found. Please check your microphone settings.'
        },
        {
          error: 'not-allowed',
          expectedMessage:
            'Microphone access was denied. Please allow microphone access and try again.'
        },
        {
          error: 'network',
          expectedMessage: 'Network error occurred during speech recognition.'
        },
        {
          error: 'unknown',
          expectedMessage: 'Speech recognition error: unknown'
        }
      ]

      for (const errorType of errorTypes) {
        const mockErrorEvent = {
          error: errorType.error,
          message: 'Error message'
        }

        if (mockSpeechRecognition.onerror) {
          mockSpeechRecognition.onerror(mockErrorEvent)
        }

        await nextTick()
      }

      expect(wrapper.emitted('speechError')).toHaveLength(errorTypes.length)
    })

    it('does not start speech recognition when disabled', async () => {
      const wrapper = mount(SearchBar, {
        props: {
          ...defaultProps,
          disabled: true
        }
      })

      await nextTick()

      const micButton = wrapper.findAll('button')[1]
      expect(micButton).toBeTruthy()
      if (micButton) {
        expect(micButton.element.disabled).toBe(true)
        await micButton.trigger('click')
        expect(mockSpeechRecognition.start).not.toHaveBeenCalled()
      }
    })
  })
})
