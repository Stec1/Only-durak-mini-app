export const tokens = {
  bg: {
    base: '#0E1013',
    gradient: {
      start: '#1C2027',
      middle: '#0E1013',
      end: '#0B0C10',
    },
  },
  card: {
    bg: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.08)',
    radius: 20,
    shadow: {
      color: '#000000',
      offset: { width: 0, height: 8 },
      opacity: 0.45,
      radius: 28,
    },
  },
  text: {
    primary: 'rgba(255,255,255,0.96)',
    secondary: 'rgba(255,255,255,0.64)',
    dim: 'rgba(255,255,255,0.40)',
  },
  accent: '#49D6E5',
  accentGlow: 'rgba(73,214,229,0.35)',
  danger: '#FF4D7A',
  divider: 'rgba(255,255,255,0.06)',
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '800' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 22,
      fontWeight: '700' as const,
      lineHeight: 28,
    },
    h3: {
      fontSize: 18,
      fontWeight: '700' as const,
      lineHeight: 24,
    },
    h4: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    caption: {
      fontSize: 13,
      fontWeight: '500' as const,
      lineHeight: 18,
    },
    meta: {
      fontSize: 12,
      fontWeight: '600' as const,
      letterSpacing: 0.8,
      textTransform: 'uppercase' as const,
    },
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
  },
} as const;

export type Tokens = typeof tokens;
