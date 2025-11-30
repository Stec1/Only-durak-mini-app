export type ThemeId = 'dark' | 'white' | 'softpink';

export type ThemeTokens = {
  bg: string;
  surface: string;
  surfaceElevated: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentBlue: string;
  accentNeon: string;
  accentSoft: string;
  border: string;
  borderSubtle: string;
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
  surface: '#0E0F12',
  surfaceElevated: '#1A1D22',
  cardBg: '#1A1D22',
  textPrimary: '#EDEFF2',
  textSecondary: '#A2A8B3',
  accent: '#42C4FF',
  accentBlue: '#42C4FF',
  accentNeon: '#42C4FF',
  accentSoft: '#163244',
  border: 'rgba(255,255,255,0.08)',
  borderSubtle: 'rgba(255,255,255,0.08)',
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
  bg: '#F5F7FA',
  surface: '#F5F7FA',
  surfaceElevated: '#FFFFFF',
  cardBg: '#FFFFFF',
  textPrimary: '#111111',
  textSecondary: '#5B6472',
  accent: '#00A8FF',
  accentBlue: '#00A8FF',
  accentNeon: '#4C5CFF',
  accentSoft: '#E5F6FF',
  border: '#E1E3EE',
  borderSubtle: 'rgba(0,0,0,0.06)',
  tabBarBg: '#FFFFFF',
  tabBarActive: '#00A8FF',
  tabBarInactive: '#A0A3B1',
  statusBarStyle: 'dark-content',
  cardShadow: {
    shadowColor: 'rgba(15, 23, 42, 0.06)',
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  cardRadius: 20,
};

const softPinkTokens: ThemeTokens = {
  bg: '#0B0B10',
  surface: '#0B0B10',
  surfaceElevated: '#251320',
  cardBg: '#251320',
  textPrimary: '#F9F4F8',
  textSecondary: '#F5A3C4',
  accent: '#FF4B8B',
  accentBlue: '#FF4B8B',
  accentNeon: '#FF4B8B',
  accentSoft: '#FF9BC4',
  border: '#3B2233',
  borderSubtle: '#3B2233',
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
