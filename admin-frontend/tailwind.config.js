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
          light: '#35917e',
          DEFAULT: '#2a7a6e',
          dark: '#1a5a50',
          dim: 'rgba(42, 122, 110, 0.15)',
        },
        light: {
          bg: '#f5f2ec',
          card: '#ede9e1',
          input: 'rgba(0, 0, 0, 0.05)',
          border: 'rgba(0, 0, 0, 0.1)',
          hover: 'rgba(0, 0, 0, 0.05)'
        },
        text: {
          primary: '#1a1a1a',
          secondary: 'rgba(0, 0, 0, 0.6)',
          muted: 'rgba(0, 0, 0, 0.4)'
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
