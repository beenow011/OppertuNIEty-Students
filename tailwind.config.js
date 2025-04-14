/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      keyframes: {
        'confetti-slow': {
          '0%': { transform: 'translateY(-10%) rotateZ(0deg)' },
          '100%': { transform: 'translateY(100vh) rotateZ(360deg)' }
        },
        'confetti-medium': {
          '0%': { transform: 'translateY(-10%) rotateZ(0deg)' },
          '100%': { transform: 'translateY(100vh) rotateZ(360deg)' }
        },
        'confetti-fast': {
          '0%': { transform: 'translateY(-10%) rotateZ(0deg)' },
          '100%': { transform: 'translateY(100vh) rotateZ(360deg)' }
        },
      },
      animation: {
        'confetti-slow': 'confetti-slow 2.25s linear infinite',
        'confetti-medium': 'confetti-medium 1.75s linear infinite',
        'confetti-fast': 'confetti-fast 1.25s linear infinite'
      }
    }
  }
  ,
  plugins: [],
}

