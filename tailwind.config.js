/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#dd0033',
          redHover: '#b9002a',
          cyan: '#00c4dd',
          cyanHover: '#00a5bb',
        }
      }
    },
  },
  plugins: [],
}
