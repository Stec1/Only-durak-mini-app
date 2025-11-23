export type ThemeId = 'dark' | 'burgundy' | 'billiard' | 'softpink';

export type ThemeValue = {
  name: string;
  bg: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
};

export const themes: Record<ThemeId, ThemeValue> = {
  dark: {
    name: 'Dark',
    bg: '#0E0F12',
    cardBg: '#1A1D22',
    textPrimary: '#EDEFF2',
    textSecondary: '#A2A8B3',
    accent: '#42C4FF',
  },
  burgundy: {
    name: 'Burgundy',
    bg: '#1A0D12',
    cardBg: '#2A131B',
    textPrimary: '#F2E9EC',
    textSecondary: '#C9A7B1',
    accent: '#FF5C7A',
  },
  billiard: {
    name: 'Billiard',
    bg: '#0E1411',
    cardBg: '#15231A',
    textPrimary: '#EAF3ED',
    textSecondary: '#B1C7B9',
    accent: '#48E07C',
  },
  softpink: {
    name: 'Soft Pink',
    bg: '#151217',
    cardBg: '#241B26',
    textPrimary: '#FFEAF5',
    textSecondary: '#E3C9D7',
    accent: '#FF86C5',
  },
};

export type ThemeName = ThemeId;

export const THEME_SWATCHES: Record<ThemeId, string> = {
  dark: '#0E0F12',
  burgundy: '#1A0D12',
  billiard: '#0E1411',
  softpink: '#151217',
};

export const THEME_LABELS: Record<ThemeId, string> = {
  dark: 'Dark',
  burgundy: 'Burgundy',
  billiard: 'Billiard Green',
  softpink: 'Soft Pink',
};

export const THEMES = themes;
