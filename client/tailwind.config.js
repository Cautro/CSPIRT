/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // ← Важно: все файлы в src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}