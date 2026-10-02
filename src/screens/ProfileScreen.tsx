import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
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
                  color={colors.primary}
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
                color={colors.primary}
              />
            </View>

            <View>
              <Text style={styles.statValue}>
                0
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
                color={colors.primary}
              />
            </View>

            <View>
              <Text style={styles.statValue}>
                0
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
                0
              </Text>

              <Text style={styles.statLabel}>
                Average
              </Text>
            </View>
          </View>
        </View>

    

        {/* ACTIVITY */}
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Recent Quizzes
              </Text>
            </View>
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
          </View>
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
      backgroundColor: colors.primary,
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

      backgroundColor: colors.primarySoft,

      paddingHorizontal: 9,
      paddingVertical: 5,

      borderRadius: 9,

      marginTop: 8,
    },

    studentText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.primary,
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

      backgroundColor: colors.primarySoft,

      alignItems: 'center',
      justifyContent: 'center',
    },

    purpleIcon: {
      width: 35,
      height: 35,
      borderRadius: 11,

      backgroundColor: colors.primarySoft,

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
      color: colors.primary,
    },

    /* QUIZZES */
    quizList: {
      gap: 9,
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