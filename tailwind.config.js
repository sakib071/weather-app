/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // This enables dark mode via a class on the root element
  theme: {
  },
  plugins: [require("daisyui")], // DaisyUI plugin for Tailwind
}
