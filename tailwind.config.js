/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Modern brand colors
        brand: {
          primary: 'var(--color-brand-primary)',
          secondary: 'var(--color-brand-secondary)',
          accent: 'var(--color-brand-accent)',
          'accent-light': 'var(--color-brand-accent-light)',
          'accent-dark': 'var(--color-brand-accent-dark)'
        },
        // Semantic colors
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        info: 'var(--color-info)',
        // Text colors
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          inverse: 'var(--color-text-inverse)'
        },
        // Background colors
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
          card: 'var(--color-bg-card)',
          elevated: 'var(--color-bg-elevated)'
        },
        // Border colors
        border: {
          light: 'var(--color-border-light)',
          medium: 'var(--color-border-medium)',
          dark: 'var(--color-border-dark)'
        }
      },
      fontSize: {
        hero: ['3rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-xl': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-lg': ['2rem', { lineHeight: '1.3', fontWeight: '700' }],
        'display-md': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }]
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ]
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem'
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem'
      },
      boxShadow: {
        'sm-modern': 'var(--shadow-sm)',
        'md-modern': 'var(--shadow-md)',
        'lg-modern': 'var(--shadow-lg)',
        'xl-modern': 'var(--shadow-xl)',
        '2xl-modern': 'var(--shadow-2xl)',
        glass: 'var(--glass-shadow)'
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-in': 'slideIn 0.4s ease forwards'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
