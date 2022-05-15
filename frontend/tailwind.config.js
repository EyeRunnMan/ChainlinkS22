module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          100: "#F8F8F8",
          200: "#E0E0E0",
          300: "#C8C8C8",
          400: "#888888",
          500: "#707070",
          600: "#505050",
          700: "#383838",
          800: "#282828",
          900: "#101010",
        },
        primary: "#00BED7",
      },
    },
  },
  plugins: [],
};
