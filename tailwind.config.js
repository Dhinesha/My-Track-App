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
          DEFAULT: "#0EA5E9",
          light: "#E0F2FE",
          dark: "#0369A1",
        },
        secondary: {
          DEFAULT: "#38BDF8",
          light: "#F0F9FF",
          dark: "#075985",
        },
        accent: "#F59E0B",
        background: {
          DEFAULT: "#f8fafc",
          card: "#FFFFFF",
          input: "#f1f5f9",
        },
        text: {
          primary: "#1e293b",
          secondary: "#64748b",
          muted: "#94a3b8",
        },
        status: {
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
          info: "#3b82f6",
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
