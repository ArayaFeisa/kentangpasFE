/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.css"
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#49A939",
          dark: "#2C6922",
          light: "#A7E19D",
          pale: "#EAFFE7",
        },
        neutral: {
          DEFAULT: "#000000",
          surface: "#F6FBF3",
          background: "#FFFFFF",
          stroke: "#D7D7D7",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
