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
    bg: '#FFFFFF',
    cardBg: '#F3F4F6',
    textPrimary: '#0F172A',
    textSecondary: '#6B7280',
    accent: '#06B6D4',
    accentSoft: '#E0F2FE',
    border: '#E5E7EB',
    tabBarBg: '#FFFFFF',
    tabBarActive: '#06B6D4',
    tabBarInactive: '#9CA3AF',
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
