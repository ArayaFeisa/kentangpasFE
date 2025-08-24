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
          DEFAULT: "#49A939", // Button bottom, leaf, "PAS!"
          dark: "#2C6922", //  Leaf
          light: "#A7E19D", // Button non-selected, line
          pale: "#EAFFE7", // Background History
        },
        neutral: {
          DEFAULT: "#000000", // text color
          surface: "#F6FBF3", // Background button & kolom field
          background: "#FFFFFF", // Main background
          stroke: "#D7D7D7", // Stroke
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
