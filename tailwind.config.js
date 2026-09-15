/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00685f',
        'primary-dark': '#004d45',
        'primary-light': '#008378',
        'primary-fixed': '#89f5e7',
        'primary-fixed-dim': '#6bd8cb',
        gold: '#d97706',
        'gold-light': '#f59e0b',
        surface: '#faf8ff',
        'surface-container': '#eaedff',
        'surface-container-low': '#f2f3ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-high': '#e2e7ff',
        'surface-container-highest': '#dae2fd',
        'on-surface': '#131b2e',
        'on-surface-variant': '#3d4947',
        outline: '#6d7a77',
        'outline-variant': '#bcc9c6',
        tertiary: '#8d4b00',
        'tertiary-fixed': '#ffdcc3',
        secondary: '#216963',
        'secondary-container': '#a8ece5',
      },
      fontFamily: {
        outfit: ['Outfit', 'system-ui', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
