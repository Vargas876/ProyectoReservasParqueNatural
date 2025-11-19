/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#e8f5e9',
            100: '#c8e6c9',
            200: '#a5d6a7',
            300: '#81c784',
            400: '#66bb6a',
            500: '#4CAF50',
            600: '#2D7A3E',
            700: '#1B5E20',
            800: '#2e7d32',
            900: '#1b5e20',
          },
          secondary: {
            500: '#795548',
            600: '#6d4c41',
            700: '#5d4037',
          },
          accent: {
            500: '#FF9800',
            600: '#F57C00',
          }
        },
      },
    },
    plugins: [],
  }
  