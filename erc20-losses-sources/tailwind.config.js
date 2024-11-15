/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
import plugin from "tailwindcss/plugin";

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
        "main-primary-hover": "#D2FFF2",
        "main-secondary": "#38554C",
        "main-blue": "#8EBCE7",
        "main-red": "#C04F4F",

        "blurry-circles-green": "#207D72",
        "blurry-circles-red": "#7D2020",
      },
      fontSize: {
        8: ["8px", "12px"],
        10: ["10px", "14px"],
        12: ["12px", "16px"],
        14: ["14px", "20px"],
        16: ["16px", "24px"],
        18: ["18px", "32px"],
        20: ["20px", "36px"],
        24: ["24px", "40px"],
        28: ["28px", "40px"],
        30: ["30px", "44px"],
        32: ["32px", "48px"],
        58: ["58px", "80px"],
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
      keyframes: {
        "breathing-pattern": {
          from: { opacity: "0.1" },
          to: { opacity: "0.5" },
        },
      },
      animation: {
        "breathing-pattern": "breathing-pattern 2s infinite linear alternate",
      },
      boxShadow: {
        "button-primary": "0px 0px 24px rgba(96, 255, 226, 0.4)",
        "button-secondary": "0px 0px 10px rgba(190, 255, 243, 0.8)",
        "card-hover-red": "0px 0px 24px rgba(255, 96, 96, 0.4)",
      }
    },
  },
  plugins: [
    plugin(function ({ addVariant, e }) {
      addVariant("hocus", ["&:hover", "&:focus-visible"]);
      addVariant("group-hocus", [".group:hover &", ".group:focus-visible &"]);
      addVariant("peer-hocus", [".peer:hover ~ &", ".peer:focus-visible ~ &"]);
    }),
  ],
};
