import { Platform, ViewStyle } from 'react-native';

export const colors = {
  bg: '#FAF7FD',
  card: '#FFFFFF',
  text: '#231535',
  heading: '#280C3D',
  muted: '#6D5C7D',
  border: '#E8DEED',
  inputBg: '#F5EFFB',
  primary: '#4C1D95',
  primarySoft: '#F3E8FF',
  success: '#22C55E',
  successSoft: '#E6F8EE',
  warning: '#F5A623',
  warningSoft: '#FEF3E0',
  danger: '#EF4444',
  dangerSoft: '#FDECEA',
};

export const radius = { sm: 10, md: 14, lg: 22, pill: 999 };

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

// Accent colors cycled across decks (Midnight Purple & complementary tones)
export const accents = ['#4C1D95', '#6D28D9', '#7C3AED', '#8B5CF6', '#A855F7', '#C084FC'];

export const shadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#2E1065',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  default: { elevation: 3 },
}) as ViewStyle;

export const scoreColor = (pct: number) =>
  pct >= 80 ? colors.success : pct >= 50 ? colors.warning : colors.danger;

export const scoreSoft = (pct: number) =>
  pct >= 80 ? colors.successSoft : pct >= 50 ? colors.warningSoft : colors.dangerSoft;