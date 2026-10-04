import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { colors as lightColors } from '../theme';

type Palette = typeof lightColors;
type Mode = 'light';

interface ThemeContextType {
  mode: Mode;
  isDark: boolean;
  colors: Palette;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = useMemo(
    () => ({
      mode: 'light' as Mode,
      isDark: false,
      colors: lightColors,
    }),
    [],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};