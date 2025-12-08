/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'nott-black': 'rgb(var(--color-nott-black) / <alpha-value>)',
        'nott-red': 'rgb(var(--color-nott-red) / <alpha-value>)',
        'nott-white': 'rgb(var(--color-nott-white) / <alpha-value>)',
        'nott-gray': 'rgb(var(--color-nott-gray) / <alpha-value>)',
        'nott-green': 'rgb(var(--color-nott-green) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
