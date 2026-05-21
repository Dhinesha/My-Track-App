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

export const fonts = {
  regular:   'PlusJakartaSans_400Regular',
  medium:    'PlusJakartaSans_500Medium',
  semiBold:  'PlusJakartaSans_600SemiBold',
  bold:      'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
};

export const textStyles = {
  screenTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: '#111111',
  },
  heroTitle: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: '#FFFFFF',
  },
  sectionLabel: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: '#1D9E75',
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  cardTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#111111',
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: '#222222',
  },
  bodyBold: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: '#111111',
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#888888',
  },
  button: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  pnr: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    letterSpacing: 3,
    color: '#111111',
  },
  roomNumber: {
    fontFamily: fonts.extraBold,
    fontSize: 40,
    color: '#111111',
  },
  sectionHeading: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: '#111111',
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
