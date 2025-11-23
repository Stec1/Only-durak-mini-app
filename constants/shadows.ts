import { ViewStyle } from 'react-native';
import { colors } from './tokens';

export const glow: ViewStyle = {
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.45,
  shadowRadius: 16,
  elevation: 0,
};

export const glowAlt: ViewStyle = {
  shadowColor: colors.glowAlt,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.32,
  shadowRadius: 16,
  elevation: 0,
};
