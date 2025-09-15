/**
 * Unit tests for Icon components
 * Tests SVG rendering, props handling, and accessibility
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LogoIcon from '../LogoIcon.vue'
import MicrophoneIcon from '../MicrophoneIcon.vue'
import MoreIcon from '../MoreIcon.vue'
import SearchButtonIcon from '../SearchButtonIcon.vue'
import UploadIcon from '../UploadIcon.vue'

describe('Icon Components', () => {
  describe('LogoIcon', () => {
    it('should render SVG with default props', () => {
      const wrapper = mount(LogoIcon)
      const svg = wrapper.find('svg')

      expect(svg.exists()).toBe(true)
      expect(svg.attributes('width')).toBe('24')
      expect(svg.attributes('height')).toBe('24')
      expect(svg.attributes('viewBox')).toBe('0 0 51 52')
      expect(svg.attributes('fill')).toBe('none')
    })

    it('should accept custom size prop', () => {
      const wrapper = mount(LogoIcon, {
        props: { size: 32 }
      })
      const svg = wrapper.find('svg')

      expect(svg.attributes('width')).toBe('32')
      expect(svg.attributes('height')).toBe('32')
    })

    it('should accept string size prop', () => {
      const wrapper = mount(LogoIcon, {
        props: { size: '48px' }
      })
      const svg = wrapper.find('svg')

      expect(svg.attributes('width')).toBe('48px')
      expect(svg.attributes('height')).toBe('48px')
    })

    it('should accept custom color prop', () => {
      const wrapper = mount(LogoIcon, {
        props: { color: '#000000' }
      })
      const paths = wrapper.findAll('path')

      paths.forEach(path => {
        expect(path.attributes('fill')).toBe('#000000')
      })
    })

    it('should use default brand color', () => {
      const wrapper = mount(LogoIcon)
      const paths = wrapper.findAll('path')

      paths.forEach(path => {
        expect(path.attributes('fill')).toBe('var(--color-brand-orange)')
      })
    })

    it('should have proper path structure', () => {
      const wrapper = mount(LogoIcon)
      const paths = wrapper.findAll('path')

      expect(paths).toHaveLength(3)
      paths.forEach(path => {
        expect(path.attributes('d')).toBeDefined()
        expect(path.attributes('d')).not.toBe('')
      })
    })
  })

  describe('MicrophoneIcon', () => {
    it('should render SVG with default props', () => {
      const wrapper = mount(MicrophoneIcon)
      const svg = wrapper.find('svg')

      expect(svg.exists()).toBe(true)
      expect(svg.attributes('width')).toBe('20')
      expect(svg.attributes('height')).toBe('20')
      expect(svg.attributes('viewBox')).toBe('0 0 25 25')
      expect(svg.attributes('fill')).toBe('none')
    })

    it('should accept custom size prop', () => {
      const wrapper = mount(MicrophoneIcon, {
        props: { size: 24 }
      })
      const svg = wrapper.find('svg')

      expect(svg.attributes('width')).toBe('24')
      expect(svg.attributes('height')).toBe('24')
    })

    it('should accept custom strokeWidth prop', () => {
      const wrapper = mount(MicrophoneIcon, {
        props: { strokeWidth: 3 }
      })
      const paths = wrapper.findAll('path')

      paths.forEach(path => {
        expect(path.attributes('stroke-width')).toBe('3')
      })
    })

    it('should use currentColor for stroke', () => {
      const wrapper = mount(MicrophoneIcon)
      const paths = wrapper.findAll('path')

      paths.forEach(path => {
        expect(path.attributes('stroke')).toBe('currentColor')
      })
    })

    it('should have proper stroke styling', () => {
      const wrapper = mount(MicrophoneIcon)
      const paths = wrapper.findAll('path')

      paths.forEach(path => {
        expect(path.attributes('stroke-linecap')).toBe('round')
        expect(path.attributes('stroke-linejoin')).toBe('round')
      })
    })

    it('should have correct number of paths', () => {
      const wrapper = mount(MicrophoneIcon)
      const paths = wrapper.findAll('path')

      expect(paths).toHaveLength(5)
    })
  })

  describe('MoreIcon', () => {
    it('should render SVG with default props', () => {
      const wrapper = mount(MoreIcon)
      const svg = wrapper.find('svg')

      expect(svg.exists()).toBe(true)
      expect(svg.attributes('width')).toBe('20')
      expect(svg.attributes('height')).toBe('20')
      expect(svg.attributes('viewBox')).toBe('0 0 17 17')
      expect(svg.attributes('fill')).toBe('none')
    })

    it('should accept custom size prop', () => {
      const wrapper = mount(MoreIcon, {
        props: { size: 16 }
      })
      const svg = wrapper.find('svg')

      expect(svg.attributes('width')).toBe('16')
      expect(svg.attributes('height')).toBe('16')
    })

    it('should accept custom color prop', () => {
      const wrapper = mount(MoreIcon, {
        props: { color: '#333333' }
      })
      const paths = wrapper.findAll('path')

      // First path uses dynamic stroke-width, others use fixed
      expect(paths[0]?.attributes('stroke')).toBe('#333333')
      expect(paths[1]?.attributes('stroke')).toBe('#333333')
      expect(paths[2]?.attributes('stroke')).toBe('#333333')
      expect(paths[3]?.attributes('stroke')).toBe('#333333')
    })

    it('should accept custom strokeWidth prop', () => {
      const wrapper = mount(MoreIcon, {
        props: { strokeWidth: 2 }
      })
      const firstPath = wrapper.findAll('path')[0]

      expect(firstPath?.attributes('stroke-width')).toBe('2')
    })

    it('should use default currentColor', () => {
      const wrapper = mount(MoreIcon)
      const paths = wrapper.findAll('path')

      paths.forEach(path => {
        expect(path.attributes('stroke')).toBe('currentColor')
      })
    })

    it('should have proper path structure for dots', () => {
      const wrapper = mount(MoreIcon)
      const paths = wrapper.findAll('path')

      expect(paths).toHaveLength(4) // Circle + 3 dots
      expect(paths[0]?.attributes('stroke-linecap')).toBe('round')
      expect(paths[0]?.attributes('stroke-linejoin')).toBe('round')
    })
  })

  describe('SearchButtonIcon', () => {
    it('should render SVG with default props', () => {
      const wrapper = mount(SearchButtonIcon)
      const svg = wrapper.find('svg')

      expect(svg.exists()).toBe(true)
      expect(svg.attributes('width')).toBe('20')
      expect(svg.attributes('height')).toBe('20')
      expect(svg.attributes('viewBox')).toBe('0 0 25 25')
      expect(svg.attributes('fill')).toBe('none')
    })

    it('should accept custom size prop', () => {
      const wrapper = mount(SearchButtonIcon, {
        props: { size: 18 }
      })
      const svg = wrapper.find('svg')

      expect(svg.attributes('width')).toBe('18')
      expect(svg.attributes('height')).toBe('18')
    })

    it('should accept custom strokeWidth prop', () => {
      const wrapper = mount(SearchButtonIcon, {
        props: { strokeWidth: 1.5 }
      })
      const paths = wrapper.findAll('path')

      paths.forEach(path => {
        expect(path.attributes('stroke-width')).toBe('1.5')
      })
    })

    it('should use currentColor for stroke', () => {
      const wrapper = mount(SearchButtonIcon)
      const paths = wrapper.findAll('path')

      paths.forEach(path => {
        expect(path.attributes('stroke')).toBe('currentColor')
      })
    })

    it('should have proper stroke styling', () => {
      const wrapper = mount(SearchButtonIcon)
      const paths = wrapper.findAll('path')

      paths.forEach(path => {
        expect(path.attributes('stroke-miterlimit')).toBe('10')
        expect(path.attributes('stroke-linecap')).toBe('round')
        expect(path.attributes('stroke-linejoin')).toBe('round')
      })
    })

    it('should represent arrow shape', () => {
      const wrapper = mount(SearchButtonIcon)
      const paths = wrapper.findAll('path')

      expect(paths).toHaveLength(2) // Arrow head + line
    })
  })

  describe('UploadIcon', () => {
    it('should render SVG with default props', () => {
      const wrapper = mount(UploadIcon)
      const svg = wrapper.find('svg')

      expect(svg.exists()).toBe(true)
      expect(svg.attributes('width')).toBe('20')
      expect(svg.attributes('height')).toBe('20')
      expect(svg.attributes('viewBox')).toBe('0 0 17 17')
      expect(svg.attributes('fill')).toBe('none')
    })

    it('should accept custom size prop', () => {
      const wrapper = mount(UploadIcon, {
        props: { size: 16 }
      })
      const svg = wrapper.find('svg')

      expect(svg.attributes('width')).toBe('16')
      expect(svg.attributes('height')).toBe('16')
    })

    it('should use currentColor for fill', () => {
      const wrapper = mount(UploadIcon)
      const path = wrapper.find('path')

      expect(path.attributes('fill')).toBe('currentColor')
    })

    it('should have single path element', () => {
      const wrapper = mount(UploadIcon)
      const paths = wrapper.findAll('path')

      expect(paths).toHaveLength(1)
    })

    it('should have path data for upload icon', () => {
      const wrapper = mount(UploadIcon)
      const path = wrapper.find('path')

      expect(path.attributes('d')).toBeDefined()
      expect(path.attributes('d')).not.toBe('')
    })

    it('should accept strokeWidth prop even though not used', () => {
      // This prop exists in interface but not used for filled icons
      const wrapper = mount(UploadIcon, {
        props: { strokeWidth: 3 }
      })

      expect(wrapper.props('strokeWidth')).toBe(3)
    })
  })

  describe('Accessibility and Standards', () => {
    const icons = [
      { component: LogoIcon, name: 'LogoIcon' },
      { component: MicrophoneIcon, name: 'MicrophoneIcon' },
      { component: MoreIcon, name: 'MoreIcon' },
      { component: SearchButtonIcon, name: 'SearchButtonIcon' },
      { component: UploadIcon, name: 'UploadIcon' }
    ]

    icons.forEach(({ component, name }) => {
      describe(`${name} Accessibility`, () => {
        it('should have proper SVG namespace', () => {
          const wrapper = mount(component)
          const svg = wrapper.find('svg')

          expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg')
        })

        it('should have proper viewBox for scalability', () => {
          const wrapper = mount(component)
          const svg = wrapper.find('svg')

          expect(svg.attributes('viewBox')).toBeDefined()
          expect(svg.attributes('viewBox')).toMatch(/^\d+\s+\d+\s+\d+\s+\d+$/)
        })

        it('should be focusable when used as interactive element', () => {
          const wrapper = mount(component)
          const svg = wrapper.find('svg')

          // SVG should not have focusability restrictions
          expect(svg.attributes('tabindex')).toBeFalsy()
        })

        it('should maintain aspect ratio', () => {
          const wrapper = mount(component, {
            props: { size: 32 }
          })
          const svg = wrapper.find('svg')

          expect(svg.attributes('width')).toBe('32')
          expect(svg.attributes('height')).toBe('32')
        })
      })
    })
  })

  describe('Props Interface Consistency', () => {
    it('should have consistent size prop interface', () => {
      const icons = [
        LogoIcon,
        MicrophoneIcon,
        MoreIcon,
        SearchButtonIcon,
        UploadIcon
      ]

      icons.forEach(IconComponent => {
        const wrapper = mount(IconComponent, {
          props: { size: 32 }
        })
        expect(wrapper.props('size')).toBe(32)

        const wrapperString = mount(IconComponent, {
          props: { size: '24px' }
        })
        expect(wrapperString.props('size')).toBe('24px')
      })
    })

    it('should handle strokeWidth prop where applicable', () => {
      const strokeIcons = [
        MicrophoneIcon,
        MoreIcon,
        SearchButtonIcon,
        UploadIcon
      ]

      strokeIcons.forEach(IconComponent => {
        const wrapper = mount(IconComponent, {
          props: { strokeWidth: 2.5 }
        })
        expect(wrapper.props('strokeWidth')).toBe(2.5)
      })
    })

    it('should handle color prop where applicable', () => {
      const colorIcons = [LogoIcon, MoreIcon]

      colorIcons.forEach(IconComponent => {
        const wrapper = mount(IconComponent, {
          props: { color: '#FF0000' }
        })
        expect(wrapper.props('color')).toBe('#FF0000')
      })
    })
  })

  describe('Default Values', () => {
    it('should use correct default sizes', () => {
      expect(mount(LogoIcon).props('size')).toBe(24)
      expect(mount(MicrophoneIcon).props('size')).toBe(20)
      expect(mount(MoreIcon).props('size')).toBe(20)
      expect(mount(SearchButtonIcon).props('size')).toBe(20)
      expect(mount(UploadIcon).props('size')).toBe(20)
    })

    it('should use correct default stroke widths', () => {
      expect(mount(MicrophoneIcon).props('strokeWidth')).toBe(2)
      expect(mount(MoreIcon).props('strokeWidth')).toBe(1.5)
      expect(mount(SearchButtonIcon).props('strokeWidth')).toBe(2)
      expect(mount(UploadIcon).props('strokeWidth')).toBe(2)
    })

    it('should use correct default colors', () => {
      expect(mount(LogoIcon).props('color')).toBe('var(--color-brand-orange)')
      expect(mount(MoreIcon).props('color')).toBe('currentColor')
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero size gracefully', () => {
      const wrapper = mount(LogoIcon, {
        props: { size: 0 }
      })
      const svg = wrapper.find('svg')

      expect(svg.attributes('width')).toBe('0')
      expect(svg.attributes('height')).toBe('0')
    })

    it('should handle very large size values', () => {
      const wrapper = mount(MicrophoneIcon, {
        props: { size: 1000 }
      })
      const svg = wrapper.find('svg')

      expect(svg.attributes('width')).toBe('1000')
      expect(svg.attributes('height')).toBe('1000')
    })

    it('should handle decimal strokeWidth values', () => {
      const wrapper = mount(MoreIcon, {
        props: { strokeWidth: 1.25 }
      })
      const firstPath = wrapper.findAll('path')[0]

      expect(firstPath?.attributes('stroke-width')).toBe('1.25')
    })

    it('should handle hex color values', () => {
      const wrapper = mount(LogoIcon, {
        props: { color: '#FFFFFF' }
      })
      const paths = wrapper.findAll('path')

      paths.forEach(path => {
        expect(path.attributes('fill')).toBe('#FFFFFF')
      })
    })

    it('should handle rgb color values', () => {
      const wrapper = mount(MoreIcon, {
        props: { color: 'rgb(255, 0, 0)' }
      })
      const paths = wrapper.findAll('path')

      paths.forEach(path => {
        expect(path.attributes('stroke')).toBe('rgb(255, 0, 0)')
      })
    })
  })
})
