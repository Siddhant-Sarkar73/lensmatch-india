/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:    '#fdf6ee',
        'cream-d':'#f5ead8',
        orange:   '#e07b39',
        'orange-d':'#c4612a',
        'orange-l':'#fef0e4',
        brown:    '#3d2c1e',
        'brown-l':'#6b4c35',
        muted:    '#8c7060',
        border:   '#e8ddd2',
        teal:     '#1e7b6e',
        'teal-d': '#155e53',
        'teal-l': '#e6f4f2',
        blue:     '#2c4e8a',
        'blue-d': '#1a3468',
        'blue-l': '#e8eef8',
        gold:     '#f5a623',
        'gold-l': '#fff8e1',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(61,44,30,0.08)',
        'card-lg': '0 8px 40px rgba(61,44,30,0.13)',
      },
    },
  },
  plugins: [],
}
