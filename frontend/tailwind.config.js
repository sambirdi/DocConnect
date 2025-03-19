/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A2647', // Your existing custom navy color
        indigo: require('tailwindcss/colors').indigo, // Adding Tailwind's indigo palette
        rose: require('tailwindcss/colors').rose,     // Adding Tailwind's rose palette
        emerald: require('tailwindcss/colors').emerald, // Adding Tailwind's emerald palette
        gray: require('tailwindcss/colors').gray,     // Ensuring gray is available (already default, but explicit for clarity)
        yellow: require('tailwindcss/colors').yellow, // Adding yellow for star ratings in testimonials
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'fade-up': 'fadeUp 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};