/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sovra theme colors (default)
        sovra: {
          'brand-orange': '#ff6b35',
          'brand-orange-light': '#f7931e',
          'brand-blue': '#4285f4',
          'text-primary': '#333',
          'text-secondary': '#666',
          'text-muted': '#999',
          'bg-primary': '#f9f7f5',
          'bg-secondary': '#f8f9fa',
          'bg-card': '#ffffff',
          'border-light': '#e5e5e5',
          'border-lighter': '#e9ecef',
          'border-hover': '#f0f0f0'
        },
        // Theme-aware semantic colors (will be overridden by themes)
        brand: {
          orange: 'var(--color-brand-orange)',
          'orange-light': 'var(--color-brand-orange-light)',
          blue: 'var(--color-brand-blue)'
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)'
        },
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          card: 'var(--color-bg-card)'
        },
        border: {
          light: 'var(--color-border-light)',
          lighter: 'var(--color-border-lighter)',
          hover: 'var(--color-border-hover)'
        }
      },
      fontSize: {
        hero: ['2.5rem', { lineHeight: '1.2' }],
        logo: ['1.8rem', { lineHeight: '1.3' }]
      },
      spacing: {
        15: '3.75rem', // 60px for avatars
        18: '4.5rem', // For padding patterns
        25: '6.25rem' // 100px for progress bars
      },
      borderRadius: {
        tag: '16px',
        search: '24px'
      },
      boxShadow: {
        card: '0 2px 10px rgba(0, 0, 0, 0.1)',
        search: '0 4px 20px rgba(0, 0, 0, 0.1)'
      },
      backgroundImage: {
        'gradient-brand':
          'linear-gradient(135deg, var(--color-brand-orange), var(--color-brand-orange-light))',
        'gradient-border':
          'linear-gradient(135deg, var(--color-brand-blue), var(--color-brand-orange))'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    // Custom plugin for theme support and utilities
    function ({ addBase, addUtilities }) {
      // Base CSS variables for themes
      addBase({
        ':root': {
          // Sovra theme (default)
          '--color-brand-orange': '#ff6b35',
          '--color-brand-orange-light': '#f7931e',
          '--color-brand-blue': '#4285f4',
          '--color-text-primary': '#333',
          '--color-text-secondary': '#666',
          '--color-text-muted': '#999',
          '--color-bg-primary': '#f9f7f5',
          '--color-bg-secondary': '#f8f9fa',
          '--color-bg-card': '#ffffff',
          '--color-border-light': '#e5e5e5',
          '--color-border-lighter': '#e9ecef',
          '--color-border-hover': '#f0f0f0'
        },
        // Dark theme example (can be expanded)
        '[data-theme="dark"]': {
          '--color-brand-orange': '#ff8c5a',
          '--color-brand-orange-light': '#ffb347',
          '--color-brand-blue': '#5a9cff',
          '--color-text-primary': '#ffffff',
          '--color-text-secondary': '#cccccc',
          '--color-text-muted': '#888888',
          '--color-bg-primary': '#1a1a1a',
          '--color-bg-secondary': '#2d2d2d',
          '--color-bg-card': '#333333',
          '--color-border-light': '#444444',
          '--color-border-lighter': '#555555',
          '--color-border-hover': '#666666'
        },
        // Blue theme example
        '[data-theme="blue"]': {
          '--color-brand-orange': '#4285f4',
          '--color-brand-orange-light': '#6ba6ff',
          '--color-brand-blue': '#1c5aa8',
          '--color-text-primary': '#1e3a8a',
          '--color-text-secondary': '#3730a3',
          '--color-text-muted': '#6366f1',
          '--color-bg-primary': '#f0f8ff',
          '--color-bg-secondary': '#dbeafe',
          '--color-bg-card': '#ffffff',
          '--color-border-light': '#bfdbfe',
          '--color-border-lighter': '#dbeafe',
          '--color-border-hover': '#e0e7ff'
        }
      })

      // Custom gradient utilities
      addUtilities({
        '.bg-gradient-brand': {
          background:
            'linear-gradient(135deg, var(--color-brand-orange), var(--color-brand-orange-light))'
        },
        '.border-gradient-brand': {
          border: '2px solid transparent',
          backgroundImage:
            'linear-gradient(var(--color-bg-card), var(--color-bg-card)), linear-gradient(135deg, var(--color-brand-blue), var(--color-brand-orange))',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box'
        },
        '.transform-scale-110': {
          transform: 'scale(1.1)'
        }
      })
    }
  ]
}
