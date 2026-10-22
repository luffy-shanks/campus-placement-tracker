/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#22252B",
        cloudWhite: "#F4F6FA",
        cobaltBlue: "#3454D1",
        moonlitSilver: "#C0C0C0",
        pureWhite: "#FFFFFF",
        successGreen: "#16845B",
        signalRed: "#E10600",
        amber: "#FFBF00",
      },
      borderRadius: {
        DEFAULT: "0.75rem", // 12px approx
        sm: "0.625rem", // 10px
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
