/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'hurricane-cat1': '#FFD700',
        'hurricane-cat2': '#FF8C00', 
        'hurricane-cat3': '#FF4500',
        'hurricane-cat4': '#DC143C',
        'hurricane-cat5': '#8B0000',
        'tropical-storm': '#00CED1',
        'tropical-depression': '#00FF00',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}