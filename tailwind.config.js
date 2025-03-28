/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}" 
  ],
  theme: {
    extend: {
      fontFamily: {
        impact: ["Impact", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
        bebas: ["Bebas Neue", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        harmonia: ['"Harmonia Sans Condensed"', 'sans-serif'],
        haboroThin: ['Haboro Contrast Cond Thin', 'sans-serif'],
        haboroBold: ['Haboro Contrast Cond Bold', 'sans-serif'],
        allura: ['Allura', 'cursive'],
        trajan: ['Trajan Pro', 'serif'],
      },
    },
  },
  plugins: [],
};