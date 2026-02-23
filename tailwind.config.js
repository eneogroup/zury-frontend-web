/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#090909',
        primary: '#E23007',
        accent: '#F63508',
        gold: '#F4A261',
        light: '#FFF8F3',
        ember: '#FF5722',
        gray: {
          50: '#FAFAF9',
          100: '#F5F1ED',
          200: '#EBE3DC',
          300: '#D6C9BD',
          400: '#9C8B7E',
          500: '#7A6A5E',
          600: '#6B5D52',
          700: '#4A3F37',
          800: '#352B24',
          900: '#2C1810',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(44, 24, 16, 0.04)',
        'DEFAULT': '0 4px 16px rgba(44, 24, 16, 0.08)',
        'md': '0 6px 24px rgba(44, 24, 16, 0.10)',
        'lg': '0 8px 32px rgba(44, 24, 16, 0.12)',
        'xl': '0 12px 48px rgba(44, 24, 16, 0.16)',
        '2xl': '0 16px 64px rgba(44, 24, 16, 0.20)',
        'inner': 'inset 0 2px 4px 0 rgba(44, 24, 16, 0.05)',
        'ember': '0 0 40px rgba(226, 48, 7, 0.25)',
        'ember-lg': '0 0 80px rgba(226, 48, 7, 0.30)',
        'gold': '0 0 30px rgba(244, 162, 97, 0.20)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '3rem',
      },
      backgroundImage: {
        'ember-gradient': 'linear-gradient(135deg, #E23007 0%, #F63508 50%, #F4A261 100%)',
        'dark-gradient': 'linear-gradient(180deg, #090909 0%, #1a0f0a 100%)',
        'noir': 'radial-gradient(ellipse at top, #1a0a05 0%, #090909 70%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'ember-pulse': 'emberPulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.94)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        emberPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(226, 48, 7, 0.15)' },
          '50%': { boxShadow: '0 0 50px rgba(226, 48, 7, 0.35)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      letterSpacing: {
        'widest': '0.25em',
        'ultrawide': '0.35em',
      },
    },
  },
  plugins: [],
}
