import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDecks } from '../context/DeckContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SettingsSection } from '../components/SettingsSection';
import { radius, spacing, shadow } from '../theme';

const pctOf = (score: number, total: number) => (total > 0 ? Math.round((score / total) * 100) : 0);

const initialsOf = (name?: string) => {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'S';
  return parts
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
};

export const ProfileScreen = () => {
  const { decks, highScores } = useDecks();
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const stats = useMemo(() => {
    if (highScores.length === 0) return { quizzes: 0, best: 0, avg: 0 };
    const pcts = highScores.map((s) => pctOf(s.score, s.totalQuestions));
    return {
      quizzes: highScores.length,
      best: Math.max(...pcts),
      avg: Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length),
    };
  }, [highScores]);

  const statItems = [
    { icon: 'document-text', label: 'Quizzes', value: `${stats.quizzes}`, color: colors.primary },
    { icon: 'trophy', label: 'Best', value: `${stats.best}%`, color: colors.success },
    { icon: 'stats-chart', label: 'Average', value: `${stats.avg}%`, color: '#F59E0B' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {/* Header card */}
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initialsOf(user?.name)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>
              {user?.name || 'Student'}
            </Text>
            {!!user?.email && (
              <Text style={styles.email} numberOfLines={1}>
                {user.email}
              </Text>
            )}
            <View style={styles.pill}>
              <Ionicons name="layers" size={13} color="#FFFFFF" />
              <Text style={styles.pillText}>
                {decks.length} {decks.length === 1 ? 'deck' : 'decks'}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {statItems.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.color + '22' }]}>
                <Ionicons name={s.icon as any} size={18} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <SettingsSection />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    list: { padding: spacing.md, paddingBottom: spacing.xl },

    hero: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      gap: spacing.md,
      ...shadow,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: 'rgba(255,255,255,0.22)',
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.6)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: { fontSize: 26, fontWeight: '800', color: '#FFFFFF' },
    name: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
    email: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 5,
      backgroundColor: 'rgba(255,255,255,0.22)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: radius.pill,
      marginTop: spacing.sm,
    },
    pillText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

    statsRow: { flexDirection: 'row', gap: spacing.sm },
    statCard: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: spacing.md,
    },
    statIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    statValue: { fontSize: 22, fontWeight: '800', color: colors.heading },
    statLabel: { fontSize: 12, color: colors.muted, marginTop: 2, fontWeight: '600' },
  });