// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores personalizadas do tema neon
        'neon-cyan': '#22d3ee',
        'neon-blue': '#3b82f6',
      },
      boxShadow: {
        'neon': '0 0 10px rgba(34, 211, 238, 0.5)',
        'neon-lg': '0 0 20px rgba(34, 211, 238, 0.6)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
