import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDecks } from '../context/DeckContext';
import { colors, radius, spacing, scoreColor, scoreSoft } from '../theme';

const pctOf = (score: number, total: number) => (total > 0 ? Math.round((score / total) * 100) : 0);

export const ProfileScreen = () => {
  const { decks, highScores } = useDecks();

  const stats = useMemo(() => {
    if (highScores.length === 0) return { quizzes: 0, best: 0, avg: 0 };
    const pcts = highScores.map((s) => pctOf(s.score, s.totalQuestions));
    return {
      quizzes: highScores.length,
      best: Math.max(...pcts),
      avg: Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length),
    };
  }, [highScores]);

  return (
    <View style={styles.container}>
      <FlatList
        data={highScores}
        keyExtractor={(item, index) => `${item.deckId}-${item.date}-${index}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={34} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.name}>Student</Text>
                <Text style={styles.sub}>
                  {decks.length} {decks.length === 1 ? 'deck' : 'decks'}
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.quizzes}</Text>
                <Text style={styles.statLabel}>Quizzes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: colors.success }]}>{stats.best}%</Text>
                <Text style={styles.statLabel}>High Score</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: colors.primary }]}>{stats.avg}%</Text>
                <Text style={styles.statLabel}>Average</Text>
              </View>
            </View>
            <Text style={styles.sectionHeader}>Quiz History</Text>
          </View>
        }
        renderItem={({ item }) => {
          const pct = pctOf(item.score, item.totalQuestions);
          return (
            <View style={styles.scoreRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.deckName} numberOfLines={1}>
                  {item.deckTitle}
                </Text>
                <Text style={styles.scoreDate}>{item.date}</Text>
              </View>
              <View style={styles.scoreRight}>
                <Text style={styles.scoreVal}>
                  {item.score} / {item.totalQuestions}
                </Text>
                <View style={[styles.pctBadge, { backgroundColor: scoreSoft(pct) }]}>
                  <Text style={[styles.pctText, { color: scoreColor(pct) }]}>{pct}%</Text>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="trophy-outline" size={48} color={colors.muted} style={{ marginBottom: spacing.sm }} />
            <Text style={styles.emptyTitle}>No scores yet</Text>
            <Text style={styles.emptyText}>Finish a quiz and your results will show up here.</Text>
          </View>
        }
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 20, fontWeight: '800', color: colors.heading },
  sub: { fontSize: 14, color: colors.muted, marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.inputBg,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: colors.heading },
  statLabel: { fontSize: 12, color: colors.muted, marginTop: 2, fontWeight: '600' },
  sectionHeader: { fontSize: 18, fontWeight: '800', color: colors.heading, marginBottom: spacing.sm },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  deckName: { fontSize: 15, fontWeight: '700', color: colors.heading },
  scoreDate: { fontSize: 12, color: colors.muted, marginTop: 2 },
  scoreRight: { alignItems: 'flex-end', gap: 4 },
  scoreVal: { fontSize: 16, fontWeight: '700', color: colors.heading },
  pctBadge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: radius.pill },
  pctText: { fontSize: 12, fontWeight: '800' },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.heading },
  emptyText: { color: colors.muted, marginTop: 4, textAlign: 'center' },
});