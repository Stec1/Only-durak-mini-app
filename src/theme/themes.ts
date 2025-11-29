export type ThemeId = 'dark' | 'white' | 'softpink';

export type ThemeTokens = {
  bg: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentSoft: string;
  border: string;
  tabBarBg: string;
  tabBarActive: string;
  tabBarInactive: string;
  statusBarStyle: 'light-content' | 'dark-content';
  cardShadow: {
    shadowColor: string;
    shadowOpacity: number;
    shadowRadius: number;
    shadowOffset: { width: number; height: number };
    elevation: number;
  };
  cardRadius: number;
};

export type ThemeValue = ThemeTokens & {
  name: string;
  tokens: ThemeTokens;
};

const darkTokens: ThemeTokens = {
  bg: '#0E0F12',
  cardBg: '#1A1D22',
  textPrimary: '#EDEFF2',
  textSecondary: '#A2A8B3',
  accent: '#42C4FF',
  accentSoft: '#163244',
  border: 'rgba(255,255,255,0.08)',
  tabBarBg: '#0E0F12',
  tabBarActive: '#42C4FF',
  tabBarInactive: '#9BA0A6',
  statusBarStyle: 'light-content',
  cardShadow: {
    shadowColor: '#000000',
    shadowOpacity: 0.45,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  cardRadius: 20,
};

const whiteTokens: ThemeTokens = {
  bg: '#F7F7FB',
  cardBg: '#FFFFFF',
  textPrimary: '#050608',
  textSecondary: '#4A4A55',
  accent: '#42C4FF',
  accentSoft: '#E5F6FF',
  border: '#E1E3EE',
  tabBarBg: '#FFFFFF',
  tabBarActive: '#42C4FF',
  tabBarInactive: '#A0A3B1',
  statusBarStyle: 'dark-content',
  cardShadow: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cardRadius: 20,
};

const softPinkTokens: ThemeTokens = {
  bg: '#0B0B10',
  cardBg: '#251320',
  textPrimary: '#F9F4F8',
  textSecondary: '#F5A3C4',
  accent: '#FF4B8B',
  accentSoft: '#FF9BC4',
  border: '#3B2233',
  tabBarBg: '#0B0B10',
  tabBarActive: '#FF4B8B',
  tabBarInactive: '#6B6B7A',
  statusBarStyle: 'light-content',
  cardShadow: {
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
  },
  cardRadius: 20,
};

export const themes: Record<ThemeId, ThemeValue> = {
  dark: { name: 'Dark', ...darkTokens, tokens: darkTokens },
  white: { name: 'White', ...whiteTokens, tokens: whiteTokens },
  softpink: { name: 'Soft Pink', ...softPinkTokens, tokens: softPinkTokens },
};

export type ThemeName = ThemeId;

export const THEME_SWATCHES: Record<ThemeId, string> = {
  dark: '#0E0F12',
  white: '#FFFFFF',
  softpink: '#0B0B10',
};

export const THEME_LABELS: Record<ThemeId, string> = {
  dark: 'Dark',
  white: 'White',
  softpink: 'Soft Pink',
};

export const THEMES = themes;
