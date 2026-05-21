import { StyleSheet } from 'react-native';
import { fonts } from '../constants/theme';

export const Typography = StyleSheet.create({
  appTitle: { fontSize: 26, fontFamily: fonts.bold, color: '#FFFFFF' },
  screenTitle: { fontSize: 20, fontFamily: fonts.semiBold, color: '#212121' },
  cardTitle: { fontSize: 16, fontFamily: fonts.semiBold, color: '#212121' },
  body: { fontSize: 14, fontFamily: fonts.regular, color: '#212121' },
  bodyMedium: { fontSize: 14, fontFamily: fonts.medium, color: '#212121' },
  subText: { fontSize: 12, fontFamily: fonts.regular, color: '#757575' },
  button: { fontSize: 15, fontFamily: fonts.bold },
  badge: { fontSize: 10, fontFamily: fonts.bold, color: '#FFFFFF' },
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

