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
          blue: "#4F6FFF",
          cyan: "#00D1FF",
          purple: "#A855F7",
        },
      },
    },
  },
  plugins: [],
}