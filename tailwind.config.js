/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        'pattern': "url('/src/assets/pattern.svg')",
      },
      colors:{
        "primary": '#2172ED',
        "primary-purple": '#4D00B4',
        "secondary-purple": '#9013FE'
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}