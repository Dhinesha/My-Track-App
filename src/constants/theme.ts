import { StyleSheet, Platform } from "react-native";

export const Colors = {
  primary: {
    main: "#2B8CEE",
    lightBg: "#EDF5FD",
    medium: "#1A74D4",
    dark: "#0F4B8C",
  },
  warning: {
    main: "#BA7517",
    lightBg: "#FEF3E2",
    textOnAmber: "#854F0B",
    border: "#F0C070",
  },
  info: {
    main: "#2A7FD4",
    lightBg: "#EBF3FC",
    text: "#1A5FA0",
  },
  urgent: {
    main: "#D94040",
    lightBg: "#FEF0F0",
    fabRed: "#E53935",
  },
  success: {
    checkIcon: "#1D9E75",
    lightBg: "#E8F5EE",
    text: "#1A7A55",
  },
  neutral: {
    pageBackground: "#F4F5F7",
    cardBackground: "#FFFFFF",
    border: "#E8E8E8",
    headerBg: "#FFFFFF",
    textPrimary: "#111111",
    textSecondary: "#555555",
    textMuted: "#888888",
    divider: "#F0F0F0",
  },
};

export const Typography = {
  fontFamilies: {
    regular: "PlusJakartaSans-Regular",
    semibold: "PlusJakartaSans-SemiBold",
    bold: "PlusJakartaSans-Bold",
    extrabold: "PlusJakartaSans-ExtraBold",
  },
  fontSizes: {
    screenTitle: 18,
    heroTripName: 26,
    heroLoc: 14,
    sectionLabel: 11,
    cardTitle: 16,
    body: 15,
    boldInline: 15,
    smallLabel: 13,
    badgeText: 12,
  },
};

export const Spacing = {
  screenPaddingH: 16,
  gap: 16,
  cardRadius: 16,
  cardPadding: 16,
  heroHeight: 220,
  headerHeight: 56,
};

export const Shadows = {
  sm: Platform.select({
    web: { boxShadow: "0 2px 4px rgba(0,0,0,0.04)" },
    default: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    },
  }) as any,
  md: Platform.select({
    web: { boxShadow: "0 4px 8px rgba(0,0,0,0.06)" },
    default: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
  }) as any,
};
