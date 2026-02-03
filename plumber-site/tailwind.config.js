/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0ea5e9',
        'brand-dark': '#0f172a',
        'brand-green': '#22c55e',
      },
    },
  },
  plugins: [],
}