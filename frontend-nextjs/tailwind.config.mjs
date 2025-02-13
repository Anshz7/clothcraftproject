/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bouquet: {
          50: "#f9f6f9",
          100: "#f4eff4",
          200: "#ebdfeb",
          300: "#dcc5db",
          400: "#c5a1c4",
          500: "#b081ad",
          600: "#9a6894",
          700: "#82547b",
          800: "#6d4767",
          900: "#5d3e59",
          950: "#362132",
        },
      },
    },
  },
  plugins: [],
};
