/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1A2A3A',
          navyLight: '#2A3A4A',
          cream: '#F5F2EA',
          gold: '#C3A34B',
          goldDark: '#b39333',
          gray: '#8C8C8C',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        source: ['"Source Sans Pro"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

module.exports = config;
