/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      colors: {
        ink: {
          50: "#F5F7FA",
          100: "#E4E9EF",
          200: "#C8D2DE",
          300: "#9BACBF",
          400: "#67809A",
          500: "#445C78",
          600: "#34485F",
          700: "#2C3E50",
          800: "#273544",
          900: "#1F2A36",
          950: "#161E27",
        },
        parchment: {
          50: "#FDFBF5",
          100: "#FBF7EF",
          200: "#F5EFE0",
          300: "#EDE2C9",
          400: "#E2D1AA",
          500: "#D4BD87",
          600: "#C2A366",
          700: "#A6874E",
          800: "#876C42",
          900: "#6E5938",
        },
        envelope: {
          50: "#FDF2F2",
          100: "#FCE3E3",
          200: "#F9C9C9",
          300: "#F4A3A3",
          400: "#EC7070",
          500: "#E04545",
          600: "#C0392B",
          700: "#A12D21",
          800: "#85281F",
          900: "#6F261F",
        },
        stamp: {
          50: "#FDF8E7",
          100: "#FAEFC4",
          200: "#F5DD88",
          300: "#EFC44B",
          400: "#E9AF2A",
          500: "#D4A017",
          600: "#B07E0F",
          700: "#8A5C10",
          800: "#724A14",
          900: "#613E16",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', "Georgia", "serif"],
        sans: ['"Noto Sans SC"', '"Source Han Sans SC"', "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "paper-texture":
          "radial-gradient(ellipse at 20% 30%, rgba(212, 160, 23, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(192, 57, 43, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(44, 62, 80, 0.03) 0%, transparent 70%)",
        "stamp-border":
          "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(44,62,80,0.1) 3px, rgba(44,62,80,0.1) 6px)",
      },
      boxShadow: {
        "letter":
          "0 1px 3px rgba(44,62,80,0.08), 0 4px 12px rgba(44,62,80,0.06)",
        "letter-hover":
          "0 4px 12px rgba(44,62,80,0.12), 0 12px 24px rgba(44,62,80,0.08)",
        "stamp":
          "inset 0 0 0 2px rgba(44,62,80,0.15), 0 2px 8px rgba(44,62,80,0.1)",
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "stamp-in": "stampIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pop-in": "popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        stampIn: {
          "0%": { opacity: "0", transform: "scale(0.8) rotate(-5deg)" },
          "60%": { transform: "scale(1.05) rotate(2deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
