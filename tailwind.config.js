/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {keyframes: {
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'counter-orbit': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
      // 👇 ADD THIS ANIMATION SECTION
      animation: {
        orbit: 'orbit 10s linear infinite',
        'counter-orbit': 'counter-orbit 10s linear infinite',
      },
    },},
  plugins: [],
}