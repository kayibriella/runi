/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
      extend: {
        keyframes: {
          'fade-in': {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          'zoom-in': {
            '0%': { transform: 'scale(0.95)' },
            '100%': { transform: 'scale(1)' },
          },
        },
        animation: {
          'fade-in': 'fade-in 0.3s ease-out',
          'zoom-in': 'zoom-in 0.3s ease-out',
        },
        colors: {
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
        },
        secondary: '#64748b',
        dark: {
          bg: '#1e1e1e',
          card: '#2d2d2d',
          border: '#3d3d3d',
          text: '#e0e0e0',
        }
      },
      spacing: {
        'section': '2rem',
      },
      borderRadius: {
        'container': '0.75rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
