import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

type TabKey = 'activity' | 'settings';

const pctOf = (score: number, total: number) =>
  total > 0 ? Math.round((score / total) * 100) : 0;

const initialsOf = (name?: string) => {
  const parts = (name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return 'S';

  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
};

export const ProfileScreen = () => {
  const decks: any[] = [];
  const highScores: any[] = [];
  const { user, logOut } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [tab, setTab] = useState<TabKey>('activity');

  const styles = useMemo(
    () => createStyles(colors),
    [colors]
  );

  const confirmLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => logOut() },
    ]);
  };

  const { stats, feed } = useMemo(() => {
    const percentages = highScores.map((item) =>
      pctOf(item.score, item.totalQuestions)
    );

    const total = highScores.length;

    return {
      stats: {
        quizzes: total,
        average: total
          ? Math.round(
              percentages.reduce(
                (sum, value) => sum + value,
                0
              ) / total
            )
          : 0,
      },

      feed: [...highScores]
        .reverse()
        .map((item, index) => ({
          number: total - index,
          score: item.score,
          total: item.totalQuestions,
          percentage: pctOf(
            item.score,
            item.totalQuestions
          ),
        })),
    };
  }, [highScores]);

  const hasQuizzes = stats.quizzes > 0;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top - 30,
          paddingBottom: insets.bottom + 110,
        }}
      >
        {/* USER PROFILE */}
        <View style={styles.profileSection}>
          <View style={styles.userRow}>
            {/* Avatar */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {initialsOf(user?.name)}
              </Text>
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <Text
                style={styles.name}
                numberOfLines={1}
              >
                {user?.name || 'Student'}
              </Text>

              {!!user?.email && (
                <Text
                  style={styles.email}
                  numberOfLines={1}
                >
                  {user.email}
                </Text>
              )}

              <View style={styles.studentBadge}>
                <Ionicons
                  name="school"
                  size={14}
                  color="#2563EB"
                />

                <Text style={styles.studentText}>
                  Student
                </Text>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={confirmLogout}
              hitSlop={8}
            >
              <Ionicons name="log-out-outline" size={24} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsCard}>
          {/* Decks */}
          <View style={styles.statItem}>
            <View style={styles.blueIcon}>
              <Ionicons
                name="albums-outline"
                size={20}
                color="#3B82F6"
              />
            </View>

            <View>
              <Text style={styles.statValue}>
                {decks.length}
              </Text>

              <Text style={styles.statLabel}>
                Decks
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Quizzes */}
          <View style={styles.statItem}>
            <View style={styles.purpleIcon}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#7C6CF2"
              />
            </View>

            <View>
              <Text style={styles.statValue}>
                {stats.quizzes}
              </Text>

              <Text style={styles.statLabel}>
                Quizzes
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Average */}
          <View style={styles.statItem}>
            <View style={styles.greenIcon}>
              <Ionicons
                name="trending-up"
                size={20}
                color="#20AD67"
              />
            </View>

            <View>
              <Text style={styles.statValue}>
                {hasQuizzes
                  ? `${stats.average}%`
                  : '—'}
              </Text>

              <Text style={styles.statLabel}>
                Average
              </Text>
            </View>
          </View>
        </View>

        {/* TABS */}
        <View style={styles.tabs}>
          <Pressable
            style={[
              styles.tabButton,
              tab === 'activity' &&
                styles.activeTabButton,
            ]}
            onPress={() => setTab('activity')}
          >
            <Ionicons
              name="stats-chart"
              size={17}
              color={
                tab === 'activity'
                  ? '#FFFFFF'
                  : colors.muted
              }
            />

            <Text
              style={[
                styles.tabText,
                tab === 'activity' &&
                  styles.activeTabText,
              ]}
            >
              Activity
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tabButton,
              tab === 'settings' &&
                styles.activeTabButton,
            ]}
            onPress={() => setTab('settings')}
          >
            <Ionicons
              name="settings-outline"
              size={18}
              color={
                tab === 'settings'
                  ? '#FFFFFF'
                  : colors.muted
              }
            />

            <Text
              style={[
                styles.tabText,
                tab === 'settings' &&
                  styles.activeTabText,
              ]}
            >
              Settings
            </Text>
          </Pressable>
        </View>

        {/* ACTIVITY */}
        {tab === 'activity' ? (
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Recent Quizzes
              </Text>

              {hasQuizzes && (
                <Text style={styles.seeAll}>
                  {stats.quizzes} completed
                </Text>
              )}
            </View>

            {hasQuizzes ? (
              <View style={styles.quizList}>
                {feed.map((item) => (
                  <View
                    key={item.number}
                    style={styles.quizCard}
                  >
                    {/* Quiz Icon */}
                    <View style={styles.quizIcon}>
                      <Ionicons
                        name="document-text-outline"
                        size={21}
                        color="#3B82F6"
                      />
                    </View>

                    {/* Quiz Information */}
                    <View style={styles.quizInfo}>
                      <Text style={styles.quizTitle}>
                        Quiz {item.number}
                      </Text>

                      <Text
                        style={styles.quizSubtitle}
                      >
                        {item.total}{' '}
                        {item.total === 1
                          ? 'question'
                          : 'questions'}
                      </Text>
                    </View>

                    {/* Percentage */}
                    <View
                      style={[
                        styles.percentageCircle,
                        {
                          borderColor:
                            item.percentage >= 80
                              ? '#22B86B'
                              : item.percentage >= 60
                              ? '#F5A623'
                              : '#EF4D56',
                        },
                      ]}
                    >
                      <Text
                        style={styles.percentageText}
                      >
                        {item.percentage}%
                      </Text>
                    </View>

                    {/* Score */}
                    <View style={styles.scoreBox}>
                      <Text style={styles.scoreText}>
                        {item.score}/{item.total}
                      </Text>

                      <Text style={styles.correctText}>
                        correct
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name="document-text-outline"
                    size={26}
                    color={colors.muted}
                  />
                </View>

                <Text style={styles.emptyTitle}>
                  No quizzes yet
                </Text>

                <Text style={styles.emptyText}>
                  Your quiz results will appear here.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.settingsContent}>
            <Text style={{color: colors.muted}}>Settings have been disabled.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const createStyles = (
  colors: ReturnType<typeof useTheme>['colors']
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },

    /* PROFILE */
    profileSection: {
      paddingHorizontal: 20,
      
    },
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
    },

    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: '#2F76ED',
      alignItems: 'center',
      justifyContent: 'center',
    },

    avatarText: {
      fontSize: 26,
      fontWeight: '900',
      color: '#FFFFFF',
    },

    userInfo: {
      flex: 1,
      marginLeft: 16,
    },

    name: {
      fontSize: 21,
      fontWeight: '900',
      color: colors.heading,
    },

    email: {
      fontSize: 13,
      color: colors.muted,
      marginTop: 3,
    },

    logoutBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FEE2E2',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 12,
    },

    studentBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',

      gap: 5,

      backgroundColor: '#E8F2FF',

      paddingHorizontal: 9,
      paddingVertical: 5,

      borderRadius: 9,

      marginTop: 8,
    },

    studentText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#2563EB',
    },

    /* STATS */
    statsCard: {
      marginHorizontal: 20,
      marginTop: 20,

      minHeight: 82,

      backgroundColor: colors.card,

      borderWidth: 1,
      borderColor: colors.border,

      borderRadius: 18,

      flexDirection: 'row',
      alignItems: 'center',

      paddingHorizontal: 12,
    },

    statItem: {
      flex: 1,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      gap: 7,
    },

    blueIcon: {
      width: 35,
      height: 35,
      borderRadius: 11,

      backgroundColor: '#E8F2FF',

      alignItems: 'center',
      justifyContent: 'center',
    },

    purpleIcon: {
      width: 35,
      height: 35,
      borderRadius: 11,

      backgroundColor: '#F0EEFF',

      alignItems: 'center',
      justifyContent: 'center',
    },

    greenIcon: {
      width: 35,
      height: 35,
      borderRadius: 11,

      backgroundColor: '#E7F8EF',

      alignItems: 'center',
      justifyContent: 'center',
    },

    statValue: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.heading,
    },

    statLabel: {
      fontSize: 10,
      color: colors.muted,
      marginTop: 1,
    },

    divider: {
      width: 1,
      height: 38,
      backgroundColor: colors.border,
    },

    /* TABS */
    tabs: {
      flexDirection: 'row',

      marginHorizontal: 20,
      marginTop: 20,

      padding: 3,

      borderRadius: 15,

      backgroundColor: '#EEF2F7',
    },

    tabButton: {
      flex: 1,
      height: 40,

      borderRadius: 12,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      gap: 7,
    },

    activeTabButton: {
      backgroundColor: '#2F76ED',
    },

    tabText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.muted,
    },

    activeTabText: {
      color: '#FFFFFF',
      fontWeight: '700',
    },

    /* CONTENT */
    content: {
      paddingHorizontal: 20,
      marginTop: 22,
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',

      marginBottom: 12,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.heading,
    },

    seeAll: {
      fontSize: 11,
      fontWeight: '600',
      color: '#2F76ED',
    },

    /* QUIZZES */
    quizList: {
      gap: 9,
    },

    quizCard: {
      minHeight: 74,

      flexDirection: 'row',
      alignItems: 'center',

      backgroundColor: colors.card,

      borderRadius: 15,

      borderWidth: 1,
      borderColor: colors.border,

      paddingHorizontal: 12,
      paddingVertical: 10,
    },

    quizIcon: {
      width: 43,
      height: 43,

      borderRadius: 12,

      backgroundColor: '#E8F2FF',

      alignItems: 'center',
      justifyContent: 'center',

      marginRight: 11,
    },

    quizInfo: {
      flex: 1,
    },

    quizTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.heading,
    },

    quizSubtitle: {
      fontSize: 11,
      color: colors.muted,
      marginTop: 3,
    },

    percentageCircle: {
      width: 45,
      height: 45,

      borderRadius: 23,

      borderWidth: 4,

      alignItems: 'center',
      justifyContent: 'center',

      marginRight: 11,
    },

    percentageText: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.heading,
    },

    scoreBox: {
      minWidth: 44,
    },

    scoreText: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.heading,
    },

    correctText: {
      fontSize: 9,
      color: colors.muted,
      marginTop: 2,
    },

    /* EMPTY */
    emptyState: {
      minHeight: 150,

      backgroundColor: colors.card,

      borderRadius: 16,

      borderWidth: 1,
      borderColor: colors.border,

      alignItems: 'center',
      justifyContent: 'center',

      padding: 20,
    },

    emptyIcon: {
      width: 45,
      height: 45,

      borderRadius: 14,

      backgroundColor: '#EEF2F7',

      alignItems: 'center',
      justifyContent: 'center',

      marginBottom: 9,
    },

    emptyTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.heading,
    },

    emptyText: {
      fontSize: 11,
      color: colors.muted,
      marginTop: 4,
    },

    /* SETTINGS */
    settingsContent: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },
  });