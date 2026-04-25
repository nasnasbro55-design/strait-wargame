/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ops: {
          bg: '#0a0c10',
          panel: '#0d1117',
          border: '#1e2a3a',
          blue: '#4a90d9',
          gold: '#c8a84b',
          red: '#8b2020',
          text: '#d4dde8',
          muted: '#666',
        }
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'Courier New', 'monospace'],
        condensed: ['"Barlow Condensed"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
