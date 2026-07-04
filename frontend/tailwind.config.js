/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        qempire: {
          dark: '#0A0A1A',
          blue: '#4169E1',
          purple: '#BF00FF',
          cyan: '#00FFFF',
          pink: '#FF007F',
          gold: '#D4AF37',
        },
      },
    },
  },
  plugins: [],
}
