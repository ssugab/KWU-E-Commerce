/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'matteblack': '2px 2px 0px 0px rgba(0, 0, 0, 0.75)',
        'neobrutalism': '8px 8px 0px 0px rgba(0, 0, 0, 0.75)',
      },
    },
  },
  plugins: [],
} 