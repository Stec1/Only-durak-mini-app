export type ThemeId = 'dark' | 'white' | 'softpink';

export type ThemeValue = {
  name: string;
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
};

export const themes: Record<ThemeId, ThemeValue> = {
  dark: {
    name: 'Dark',
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
  },
  white: {
    name: 'White',
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
  },
  softpink: {
    name: 'Soft Pink',
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
  },
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
