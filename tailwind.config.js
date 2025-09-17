/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Theme-aware semantic colors using CSS variables
        brand: {
          orange: 'var(--color-brand-orange)',
          'orange-light': 'var(--color-brand-orange-light)',
          'orange-dark': 'var(--color-brand-orange-dark)',
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
          card: 'var(--color-bg-card)',
          'card-dark': 'var(--color-bg-card-dark)'
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
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
