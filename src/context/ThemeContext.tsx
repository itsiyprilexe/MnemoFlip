import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { colors as lightColors } from '../theme';

type Palette = typeof lightColors;
type Mode = 'light';

interface ThemeContextType {
  mode: Mode; // The current theme mode (e.g., 'light').
  //isDark: boolean;// Boolean flag indicating whether the theme is dark mode.
  colors: Palette;// The active color palette used throughout the application.
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
// React context that provides theme information (mode, dark flag, and colors)
// to components in the application. Initialized as undefined until wrapped
// by the ThemeProvider.


export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = useMemo(
    () => ({
      mode: 'light' as Mode,// Fixed theme mode set to 'light'.
    //  isDark: false,// Explicitly marks the theme as non-dark.
      colors: lightColors,// Provides the light color palette to consumers.
    }),
    [],
  );
  // Memoized theme value object to avoid unnecessary re-renders. Contains
  // all theme-related properties exposed via the context.


  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
   // Context provider component that supplies the theme state and values to
  // its child components. Wraps the application to ensure consistent theming.
};


export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
// Custom hook to access the ThemeContext. Ensures that theme values are only
// consumed within a ThemeProvider. Throws an error if used outside the provider.