import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, ThemeId, ThemeValue, ThemeTokens } from '../theme/themes';

type Ctx = {
  themeId: ThemeId;
  theme: ThemeValue;
  tokens: ThemeTokens;
  setThemeId: (id: ThemeId) => void;
};

const ThemeContext = createContext<Ctx | undefined>(undefined);
const STORAGE_KEY = 'onlydurak.themeId';
const DEFAULT_ID: ThemeId = 'dark';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<ThemeId>(DEFAULT_ID);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved && (saved in themes)) {
          setThemeIdState(saved as ThemeId);
        } else if (saved) {
          setThemeIdState(DEFAULT_ID);
          AsyncStorage.setItem(STORAGE_KEY, DEFAULT_ID).catch(() => {});
        }
      } catch {}
    })();
  }, []);

  const setThemeId = useCallback((id: ThemeId) => {
    setThemeIdState(id);
    AsyncStorage.setItem(STORAGE_KEY, id).catch(() => {});
  }, []);

  const theme = useMemo(() => themes[themeId], [themeId]);

  const value = useMemo(
    () => ({ themeId, theme, tokens: theme.tokens, setThemeId }),
    [themeId, theme, setThemeId]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeCtx = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeCtx must be used within ThemeProvider');
  return ctx;
};

export const useTheme = () => {
  const { themeId, setThemeId } = useThemeCtx();
  return { themeName: themeId, setTheme: setThemeId };
};

export const useTokens = () => {
  const { tokens, themeId } = useThemeCtx();

  const isDark = themeId !== 'white';

  return {
    bg: tokens.bg,
    surface: tokens.surface,
    surfaceElevated: tokens.surfaceElevated,
    cardBg: tokens.cardBg,
    textOnAccent: tokens.textOnAccent,
    text: tokens.textPrimary,
    subtext: tokens.textSecondary,
    accent: tokens.accent,
    accentBlue: tokens.accentBlue,
    accentNeon: tokens.accentNeon,
    accentSoft: tokens.accentSoft,
    border: tokens.border,
    borderSubtle: tokens.borderSubtle,
    chipBackground: tokens.chipBackground,
    progressTrack: tokens.progressTrack,
    surfaceGlass: tokens.surfaceGlass,
    tabBarBg: tokens.tabBarBg,
    tabBarActive: tokens.tabBarActive,
    tabBarInactive: tokens.tabBarInactive,
    statusBarStyle: tokens.statusBarStyle,
    cardShadow: tokens.cardShadow,
    cardRadius: tokens.cardRadius,
    isDark,
    themeName: themeId,
  };
};
