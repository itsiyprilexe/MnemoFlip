import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDecks } from '../context/DeckContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SettingsSection } from '../components/SettingsSection';
import { radius, spacing } from '../theme';

type TabKey = 'activity' | 'settings';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'activity', label: 'Activity' },
  { key: 'settings', label: 'Settings' },
];

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
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [tab, setTab] = useState<TabKey>('activity');

  const { stats, feed } = useMemo(() => {
    const pcts = highScores.map((s) => pctOf(s.score, s.totalQuestions));
    const total = highScores.length;
    return {
      stats: {
        quizzes: total,
        best: total ? Math.max(...pcts) : 0,
        avg: total ? Math.round(pcts.reduce((a, b) => a + b, 0) / total) : 0,
      },
      // Newest first, like a feed.
      feed: [...highScores].reverse().map((s, i) => ({
        n: total - i,
        score: s.score,
        total: s.totalQuestions,
        pct: pctOf(s.score, s.totalQuestions),
      })),
    };
  }, [highScores]);

  const hasQuizzes = stats.quizzes > 0;
  const deckLabel = `${decks.length} ${decks.length === 1 ? 'deck' : 'decks'}`;
  const quizLabel = `${stats.quizzes} ${stats.quizzes === 1 ? 'quiz' : 'quizzes'}`;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: text left, avatar right */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.name} numberOfLines={1}>
              {user?.name || 'Student'}
            </Text>
            {!!user?.email && (
              <Text style={styles.email} numberOfLines={1}>
                {user.email}
              </Text>
            )}
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initialsOf(user?.name)}</Text>
          </View>
        </View>

        <Text style={styles.meta}>
          {deckLabel} · {quizLabel}
        </Text>

        {/* Two outlined stat buttons */}
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{hasQuizzes ? `${stats.best}%` : '–'}</Text>
            <Text style={styles.statLabel}>Best score</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{hasQuizzes ? `${stats.avg}%` : '–'}</Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => setTab(t.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                style={[styles.tab, active && styles.tabActive]}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Content */}
        {tab === 'activity' ? (
          hasQuizzes ? (
            feed.map((item) => (
              <View key={item.n} style={styles.row}>
                <View style={styles.rowIcon}>
                  <Ionicons name="document-text-outline" size={18} color={colors.muted} />
                </View>
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle}>Quiz {item.n}</Text>
                  <Text style={styles.rowSub}>
                    {item.score} of {item.total} correct
                  </Text>
                </View>
                <Text style={styles.rowPct}>{item.pct}%</Text>
              </View>
            ))
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No quizzes yet</Text>
              <Text style={styles.emptyBody}>Finish a quiz and your scores will show up here.</Text>
            </View>
          )
        ) : (
          <View style={styles.settings}>
            <SettingsSection />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      gap: spacing.md,
    },
    headerText: { flex: 1 },
    name: { fontSize: 28, fontWeight: '800', color: colors.heading, letterSpacing: -0.4 },
    email: { fontSize: 15, color: colors.muted, marginTop: 2 },
    avatar: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
    meta: {
      fontSize: 15,
      color: colors.muted,
      paddingHorizontal: spacing.lg,
      marginTop: spacing.md,
    },

    // Stat buttons
    statRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      marginTop: spacing.md,
    },
    statBox: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md ?? 12,
    },
    statValue: { fontSize: 18, fontWeight: '800', color: colors.heading },
    statLabel: { fontSize: 12, fontWeight: '600', color: colors.muted, marginTop: 2 },

    // Tabs
    tabs: { flexDirection: 'row', marginTop: spacing.lg },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    tabActive: { borderBottomWidth: 2, borderBottomColor: colors.heading },
    tabText: { fontSize: 15, fontWeight: '600', color: colors.muted },
    tabTextActive: { color: colors.heading, fontWeight: '700' },

    // Feed rows
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: 14,
      gap: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    rowIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowBody: { flex: 1 },
    rowTitle: { fontSize: 15, fontWeight: '700', color: colors.heading },
    rowSub: { fontSize: 14, color: colors.muted, marginTop: 1 },
    rowPct: { fontSize: 20, fontWeight: '800', color: colors.heading },

    // Empty + settings
    empty: { alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.lg },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.heading },
    emptyBody: { fontSize: 14, color: colors.muted, marginTop: 4, textAlign: 'center' },
    settings: { padding: spacing.md },
  });