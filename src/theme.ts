import { Platform, ViewStyle } from 'react-native';

export const colors = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1F2340',
  heading: '#1E1B4B',
  muted: '#6B7280',
  border: '#E9EAF3',
  inputBg: '#F3F4F9',
  primary: '#5B4CF0',
  primarySoft: '#EEEBFF',
  success: '#22C55E',
  successSoft: '#E6F8EE',
  warning: '#F5A623',
  warningSoft: '#FEF3E0',
  danger: '#EF4444',
  dangerSoft: '#FDECEA',
};

export const radius = { sm: 10, md: 14, lg: 22, pill: 999 };

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

// Accent colors cycled across decks (used as icon tile tints)
export const accents = ['#7C5CF0', '#2CB1E1', '#F59E0B', '#EF4444', '#22C55E', '#EC6FA0'];

export const shadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#3B3486',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  default: { elevation: 3 },
}) as ViewStyle;

export const scoreColor = (pct: number) =>
  pct >= 80 ? colors.success : pct >= 50 ? colors.warning : colors.danger;

export const scoreSoft = (pct: number) =>
  pct >= 80 ? colors.successSoft : pct >= 50 ? colors.warningSoft : colors.dangerSoft;