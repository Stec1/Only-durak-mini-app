import { TextStyle } from 'react-native';
import { colors } from './tokens';

export const typography = {
  h1: {
    fontFamily: 'Orbitron_800ExtraBold',
    fontSize: 32,
    lineHeight: 40,
    color: colors.text,
    letterSpacing: 0.5,
  } as TextStyle,
  h2: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 26,
    lineHeight: 32,
    color: colors.text,
    letterSpacing: 0.3,
  } as TextStyle,
  subtitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
    letterSpacing: 0.2,
  } as TextStyle,
  body: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  } as TextStyle,
  meta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: colors.textDim,
  } as TextStyle,
  number: {
    fontFamily: 'Rajdhani_700Bold',
    fontSize: 18,
    lineHeight: 22,
    color: colors.text,
  } as TextStyle,
};
