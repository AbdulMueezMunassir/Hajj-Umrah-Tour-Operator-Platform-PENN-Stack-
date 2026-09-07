const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00685f',
        'primary-dark': '#004d45',
        'primary-light': '#008378',
        gold: '#d97706',
        surface: '#faf8ff',
        'surface-dim': '#d2d9f4',
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
        'tertiary-fixed-dim': '#ffb77d',
        secondary: '#216963',
        'secondary-container': '#a8ece5',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        xl: '1.5rem',
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;