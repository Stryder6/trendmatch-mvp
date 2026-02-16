/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: { primary: '#0A0A0B', secondary: '#111114', card: '#16161A', hover: '#1C1C21' },
        accent: { DEFAULT: '#FF3B5C', glow: 'rgba(255, 59, 92, 0.15)' },
        teal: '#00D1C1',
        purple: '#8B5CF6',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
