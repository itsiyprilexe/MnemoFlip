import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors as lightColors } from '../theme';

type Palette = typeof lightColors;
type Mode = 'light' | 'dark';

const THEME_KEY = '@flashcards/theme';

// Dark palette: starts from your light colors and overrides the main ones.
// If your theme.ts has other color keys (card, border, etc.), add dark versions here.
const darkColors: Palette = {
  ...lightColors,
  bg: '#0F172A',
  heading: '#F8FAFC',
  muted: '#94A3B8',
};

interface ThemeContextType {
  mode: Mode;
  isDark: boolean;
  colors: Palette;
  setMode: (mode: Mode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<Mode>('light');

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark') setModeState(saved);
      })
      .catch((e) => console.warn('Failed to load theme', e));
  }, []);

  const setMode = (next: Mode) => {
    setModeState(next);
    AsyncStorage.setItem(THEME_KEY, next).catch((e) => console.warn('Failed to save theme', e));
  };

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      colors: mode === 'dark' ? darkColors : lightColors,
      setMode,
    }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};