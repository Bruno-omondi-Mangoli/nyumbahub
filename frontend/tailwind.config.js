/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#e6f4ef",
          100: "#c2e3d4",
          200: "#9ad1b8",
          300: "#6fbe9b",
          400: "#4aaf84",
          500: "#27a06e",
          600: "#1a8f5e",
          700: "#0f7a4e",
          800: "#06643e",
          900: "#004d2e",
        },
        dark: {
          900: "#0a2e1f",
          800: "#0d3d29",
          700: "#114d34",
          600: "#166040",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}