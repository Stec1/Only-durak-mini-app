import { TextStyle } from 'react-native';
import Colors from './colors';
import type { Suit } from '../utils/deck';

export const FONTS = {
  regular: 'System' as const,
  medium: 'System' as const,
  semiBold: 'System' as const,
  bold: 'System' as const,
  extraBold: 'System' as const,
};

export const FONT_SIZES = {
  xs: 11,
  sm: 13,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const SHADOWS = {
  neonCyan: {
    shadowColor: Colors.neon.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  neonPurple: {
    shadowColor: Colors.neon.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  neonPink: {
    shadowColor: Colors.neon.pink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  neonGreen: {
    shadowColor: Colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
};

export const TEXT_STYLES = {
  h1: {
    fontSize: FONT_SIZES['6xl'],
    fontWeight: '900' as const,
    color: Colors.text.primary,
    letterSpacing: 2,
  } as TextStyle,
  h2: {
    fontSize: FONT_SIZES['4xl'],
    fontWeight: '700' as const,
    color: Colors.text.primary,
    letterSpacing: 1,
  } as TextStyle,
  h3: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700' as const,
    color: Colors.text.primary,
  } as TextStyle,
  body: {
    fontSize: FONT_SIZES.base,
    fontWeight: '400' as const,
    color: Colors.text.primary,
  } as TextStyle,
  caption: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '400' as const,
    color: Colors.text.secondary,
  } as TextStyle,
  button: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
  } as TextStyle,
};

export const GLASS_STYLE = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: RADIUS.lg,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.1)',
};

export const SUIT_CONFIG: Record<Suit, { key: Suit; color: string; pip: string }> = {
  spade: { key: 'spade', color: '#57E6FF', pip: '♠' },
  heart: { key: 'heart', color: '#FF6B87', pip: '♥' },
  club: { key: 'club', color: '#5AF28C', pip: '♣' },
  diamond: { key: 'diamond', color: '#58E1FF', pip: '♦' },
};

export const GAME_COLORS = {
  bg: '#0C0F13',
  card: '#141922',
  cardOutline: '#00D6CF',
  text: '#E9EEF6',
  sub: '#A9B3C1',
  accent: '#00E6D7',
  danger: '#FF5D5D',
  shadow: 'rgba(0,0,0,0.35)',
};

const Theme = {
  colors: Colors,
  fonts: FONTS,
  fontSizes: FONT_SIZES,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
  textStyles: TEXT_STYLES,
  glass: GLASS_STYLE,
  suits: SUIT_CONFIG,
  game: GAME_COLORS,
};

export default Theme;
