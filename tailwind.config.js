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
          DEFAULT: "#0F6E56",
          light: "#E0F2F1",
          dark: "#004D40",
        },
        secondary: {
          DEFAULT: "#2979FF",
          light: "#E3F2FD",
          dark: "#1565C0",
        },
        accent: "#FF9800",
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
