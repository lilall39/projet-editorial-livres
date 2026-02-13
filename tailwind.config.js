/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fond: "#EFFAFD",
        principal: "#4A8BDF",
        alerte: "#A0006D",
      },
    },
  },
  plugins: [],
};
