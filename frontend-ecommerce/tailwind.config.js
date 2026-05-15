/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forge: {
          black: '#0A0A0A',
          dark: '#111111',
          gray: '#1A1A1A',
          mid: '#2A2A2A',
          silver: '#B8B8B8',
          silverLight: '#D4D4D4',
          silverDark: '#6B6B6B',
          orange: '#FF5E00',
          orangeLight: '#FF7A2E',
          orangeDark: '#CC4B00',
        }
      },
      fontFamily: {
        heading: ['Oswald', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
