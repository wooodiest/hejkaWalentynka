/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        // Pastel rose shades for the background
        rose: {
          50: "#fff1f5",
          100: "#ffe4ed",
          200: "#fec5d8",
        },
      },
    },
  },
  plugins: [],
};

