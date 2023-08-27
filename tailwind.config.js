/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      screens: {
        xl: '750px',
      },
      padding: {
        DEFAULT: '24px',
      },
    },
    extend: {
      colors: {
        dark: '#333',
        white: '#fff',
        primary: '#ed2e7c',
        secondary: '#ff8bbb',
      },
    },
  },
  plugins: [],
};
