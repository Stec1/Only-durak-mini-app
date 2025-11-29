import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, ThemeId, ThemeValue } from '../theme/themes';

type Ctx = {
  themeId: ThemeId;
  theme: ThemeValue;
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

  const value = useMemo(() => ({ themeId, theme, setThemeId }), [themeId, theme, setThemeId]);

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
  const { theme } = useThemeCtx();
  return {
    bg: theme.bg,
    cardBg: theme.cardBg,
    text: theme.textPrimary,
    subtext: theme.textSecondary,
    accent: theme.accent,
    border: theme.border,
  };
};
