/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2B8CEE",
          light: "#EDF5FD",
          medium: "#1A74D4",
          dark: "#0F4B8C",
        },
        secondary: {
          DEFAULT: "#1A74D4",
          light: "#EDF5FD",
          dark: "#0F4B8C",
        },
        warning: {
          DEFAULT: "#BA7517",
          light: "#FEF3E2",
          text: "#854F0B",
          border: "#F0C070",
        },
        info: {
          DEFAULT: "#2A7FD4",
          light: "#EBF3FC",
          text: "#1A5FA0",
        },
        urgent: {
          DEFAULT: "#D94040",
          light: "#FEF0F0",
          fab: "#E53935",
        },
        success: {
          check: "#1D9E75",
          light: "#E8F5EE",
          text: "#1A7A55",
        },
        neutral: {
          pageBg: "#F4F5F7",
          cardBg: "#FFFFFF",
          border: "#E8E8E8",
          headerBg: "#FFFFFF",
          textPrimary: "#111111",
          textSecondary: "#555555",
          textMuted: "#888888",
          divider: "#F0F0F0",
        },
        accent: "#BA7517",
        background: {
          DEFAULT: "#F4F5F7",
          card: "#FFFFFF",
          input: "#FFFFFF",
        },
        text: {
          primary: "#111111",
          secondary: "#555555",
          muted: "#888888",
        },
        status: {
          success: "#1D9E75",
          warning: "#BA7517",
          error: "#D94040",
          info: "#2A7FD4",
        },
      },
      fontFamily: {
        "jakarta-regular": ["PlusJakartaSans-Regular"],
        "jakarta-medium": ["PlusJakartaSans-Medium"],
        "jakarta-semibold": ["PlusJakartaSans-SemiBold"],
        "jakarta-bold": ["PlusJakartaSans-Bold"],
        "jakarta-extrabold": ["PlusJakartaSans-ExtraBold"],
      },
      borderRadius: {
        "8xl": "32px",
      },
    },

  },
  plugins: [],
};
