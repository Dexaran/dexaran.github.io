/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        openSans: "var(--font-open-sans)",
        goldman: "var(--font-goldman)",
        // sans: ["var(--font-open-sans)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        purple: "#9576EC",
        green: "#82BDAB",

        blue: "#22AEFC",
        red: "#C04F4F",
        orange: "#D38932",
        white: "#FFFFFF",
        placeholder: "#7F7F7F",

        green_hover: "#2DBF61",

        "border-primary": "#5A5A5A",
        "border-secondary": "#30363D",

        "primary-text": "#E3E3E3",
        "secondary-text": "#8E93A3",

        "primary-bg": "#1E2024",
        "secondary-bg": "#25272C",
        "tertiary-bg": "#2E3037",
        "textarea-bg": "#121212",
        "blue-bg": "#28323C",

        "main-primary": "#82BDAB",
        "main-secondary": "#38554C",
        "main-blue": "#8EBCE7",
        "main-red": "#C04F4F"
      },
      borderRadius: {
        0: "0px",
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        20: "80px",
        full: "50%",
      },
    },
  },
  plugins: [],
};
