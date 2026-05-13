import { StyleSheet } from 'react-native';

export const Typography = StyleSheet.create({
  appTitle: { fontSize: 26, fontFamily: 'PlusJakartaSans-Bold', color: '#FFFFFF' },
  screenTitle: { fontSize: 20, fontFamily: 'PlusJakartaSans-SemiBold', color: '#212121' },
  cardTitle: { fontSize: 16, fontFamily: 'PlusJakartaSans-SemiBold', color: '#212121' },
  body: { fontSize: 14, fontFamily: 'PlusJakartaSans-Regular', color: '#212121' },
  bodyMedium: { fontSize: 14, fontFamily: 'PlusJakartaSans-Medium', color: '#212121' },
  subText: { fontSize: 12, fontFamily: 'PlusJakartaSans-Regular', color: '#757575' },
  button: { fontSize: 15, fontFamily: 'PlusJakartaSans-Bold' },
  badge: { fontSize: 10, fontFamily: 'PlusJakartaSans-Bold', color: '#FFFFFF' },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const Radius = {
  sm: 4,
  md: 8, // Buttons
  lg: 12, // Cards
  xl: 16,
  xxl: 24,
  full: 999,
};

