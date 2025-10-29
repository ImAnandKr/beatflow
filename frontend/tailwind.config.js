/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#1DB954', // Spotify green (example)
          DEFAULT: '#1DB954',
          dark: '#1ED760',
        },
      },
    },
  },
  plugins: [],
};