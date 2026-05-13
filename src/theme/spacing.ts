// Consistent spacing scale (4px base)
import { Platform } from "react-native";

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

// Border radius tokens
export const Radius = {
  none: 0,
  sm: 4,
  md: 8, // Buttons, small components
  lg: 12, // Cards, modals
  xl: 16, // Large sections
  xxl: 24, // Extra large
  full: 999, // Circles
} as const;

// Shadow definitions for elevation
export const Shadows = {
  sm: Platform.select({
    web: { boxShadow: "0 2px 3.84px rgba(0, 0, 0, 0.1)" },
    default: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 2,
    },
  }) as any,
  md: Platform.select({
    web: { boxShadow: "0 4px 5.46px rgba(0, 0, 0, 0.15)" },
    default: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 5.46,
      elevation: 4,
    },
  }) as any,
  lg: Platform.select({
    web: { boxShadow: "0 8px 8px rgba(0, 0, 0, 0.2)" },
    default: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
  }) as any,
  xl: Platform.select({
    web: { boxShadow: "0 12px 12px rgba(0, 0, 0, 0.25)" },
    default: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
    },
  }) as any,
} as const;

// Animation durations
export const AnimationDuration = {
  fast: 150,
  base: 250,
  slow: 400,
  verySlow: 600,
} as const;
