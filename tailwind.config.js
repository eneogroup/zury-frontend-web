/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#090909',        // Brun chocolat profond (terre africaine)
        primary: '#E23007',     // Rouge tomate vif (appétissant)
        accent: '#F63508',      // Vert émeraude (fraîcheur)
        gold: '#F4A261',        // Orange terracotta (chaleur)
        light: '#FFF8F3',       // Crème vanille
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
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(44, 24, 16, 0.04)',
        'DEFAULT': '0 4px 16px rgba(44, 24, 16, 0.08)',
        'md': '0 6px 24px rgba(44, 24, 16, 0.10)',
        'lg': '0 8px 32px rgba(44, 24, 16, 0.12)',
        'xl': '0 12px 48px rgba(44, 24, 16, 0.16)',
        '2xl': '0 16px 64px rgba(44, 24, 16, 0.20)',
        'inner': 'inset 0 2px 4px 0 rgba(44, 24, 16, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}