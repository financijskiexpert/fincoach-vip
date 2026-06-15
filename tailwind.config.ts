import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1B2A',
          50: '#1a2f47',
          100: '#162540',
          200: '#112035',
          300: '#0D1B2A',
          400: '#091623',
          500: '#06101c',
          600: '#030b13',
          700: '#01060a',
          800: '#000204',
          900: '#000000',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#f5e9a0',
          100: '#f0e08a',
          200: '#e8d065',
          300: '#e0c040',
          400: '#D4AF37',
          500: '#b8962e',
          600: '#9c7d25',
          700: '#80641c',
          800: '#644b13',
          900: '#48320a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
