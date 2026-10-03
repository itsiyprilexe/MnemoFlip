import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useStorage } from '../context/StorageContext';
import { radius, spacing, accents } from '../theme';

const ICONS = [
  'book',
  'school',
  'flask',
  'calculator',
  'leaf',
  'color-palette',
] as const;

export const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { colors } = useTheme();
  const { user } = useAuth();
  const { decks, quizzes } = useStorage();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [query, setQuery] = useState('');

  // Search decks
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? decks.filter((deck) => deck.title.toLowerCase().includes(q))
      : decks;
  }, [decks, query]);

  const greetingName = user?.name ? `Hello, ${user.name}!` : 'Hello, Student!';

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 110,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* =========================
            GREETING
        ========================= */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greeting}>{greetingName}</Text>
            <Text style={styles.greetingSubtitle}>
              Ready to study today?
            </Text>
          </View>

          <View style={styles.profile}>
            <TouchableOpacity
              onPress={() => (navigation as any).navigate('ProfileTab')}
              activeOpacity={0.7}
              accessibilityLabel="View Profile"
            >
              <Ionicons
                name="person"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* =========================
            SEARCH
        ========================= */}
        <View style={styles.searchWrap}>
          <Ionicons
            name="search-outline"
            size={19}
            color={colors.muted}
          />

          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search your decks..."
            placeholderTextColor={colors.muted}
          />

          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery('')}
              hitSlop={10}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.muted}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* =========================
            LEARNING BANNER
        ========================= */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerLabel}>KEEP LEARNING</Text>
            <Text style={styles.bannerTitle}>Build your knowledge</Text>
            <Text style={styles.bannerText}>
              Study your flashcards, review your decks, and test yourself with quizzes.
            </Text>
          </View>
        </View>

        {/* =========================
            STATISTICS
        ========================= */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => (navigation as any).navigate('DecksTab')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.primary + '18' },
              ]}
            >
              <Ionicons
                name="library-outline"
                size={20}
                color={colors.primary}
              />
            </View>

            <View>
              <Text style={styles.statNumber}>{decks.length}</Text>
              <Text style={styles.statLabel}>
                {decks.length === 1 ? 'Deck' : 'Decks'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => (navigation as any).navigate('QuizTab')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.statIcon,
                { backgroundColor: '#F59E0B18' },
              ]}
            >
              <Ionicons
                name="albums-outline"
                size={20}
                color="#F59E0B"
              />
            </View>

            <View>
              <Text style={styles.statNumber}>{quizzes.length}</Text>
              <Text style={styles.statLabel}>
                {quizzes.length === 1 ? 'Quiz' : 'Quizzes'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* =========================
            DECKS SECTION
        ========================= */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.section}>My Decks</Text>
            <Text style={styles.sectionSubtitle}>
              Continue where you left off
            </Text>
          </View>

          {decks.length > 0 && (
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => (navigation as any).navigate('DecksTab')}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllText}>View all</Text>
              <Ionicons
                name="chevron-forward"
                size={15}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Decks List or Empty State */}
        {filtered.length > 0 ? (
          filtered.map((item, index) => {
            const accent = accents[index % accents.length];
            const count = item.cards.length;

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.7}
                onPress={() =>
                  Alert.alert(
                    'Under Construction',
                    'This feature is coming soon!',
                  )
                }
              >
                {/* Icon Circle */}
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: accent + '22' },
                  ]}
                >
                  <Ionicons
                    name={ICONS[index % ICONS.length]}
                    size={24}
                    color={accent}
                  />
                </View>

                {/* Deck Info */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    {count} {count === 1 ? 'card' : 'cards'}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.muted}
                  style={{ marginRight: 4 }}
                />
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name={query ? 'search-outline' : 'library-outline'}
                size={30}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              {query ? 'No decks found' : 'No decks yet'}
            </Text>

            <Text style={styles.emptyText}>
              {query
                ? 'Try searching for another deck.'
                : 'Go to the Decks tab and create your first study set.'}
            </Text>

            {!query && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => (navigation as any).navigate('DecksTab')}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.emptyButtonText}>Create a deck</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const createStyles = (
  colors: ReturnType<typeof useTheme>['colors']
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },

    scrollContent: {
      paddingHorizontal: spacing.md,
    },

    header: {
      marginBottom: spacing.sm,
    },

    // =========================
    // GREETING
    // =========================

    greetingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingHorizontal: 4,
    },

    greeting: {
      fontSize: 27,
      fontWeight: '800',
      color: colors.heading,
      letterSpacing: -0.4,
    },

    greetingSubtitle: {
      fontSize: 13,
      color: colors.muted,
      marginTop: 3,
      fontWeight: '500',
    },

    profile: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary + '18',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },

    // =========================
    // SEARCH
    // =========================

    searchWrap: {
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      backgroundColor: colors.inputBg,
      borderRadius: radius.lg,
      paddingHorizontal: 15,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      marginBottom: 16,
    },

    searchInput: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      paddingVertical: 0,
    },

    // =========================
    // BANNER
    // =========================

    banner: {
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: colors.primary,
      borderRadius: 24,
      padding: 20,
      minHeight: 180,
      justifyContent: 'center',
    },

    bannerContent: {
      zIndex: 2,
      maxWidth: '80%',
    },

    bannerIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        'rgba(255,255,255,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },

    bannerLabel: {
      fontSize: 10,
      fontWeight: '800',
      color: '#DDD8FF',
      letterSpacing: 1.3,
      marginBottom: 6,
    },

    bannerTitle: {
      fontSize: 23,
      fontWeight: '800',
      color: '#FFFFFF',
      marginBottom: 7,
    },

    bannerText: {
      fontSize: 13,
      color: '#E4E0FF',
      lineHeight: 19,
    },

    // =========================
    // STATS
    // =========================

    statsRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 12,
    },

    statCard: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth:
        StyleSheet.hairlineWidth,
      borderColor: colors.border,
      padding: 14,
      gap: 11,
    },

    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },

    statNumber: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.heading,
    },

    statLabel: {
      fontSize: 11,
      color: colors.muted,
      marginTop: 1,
    },

    // =========================
    // SECTION
    // =========================

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 28,
      marginBottom: 12,
      paddingHorizontal: 4,
    },

    section: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.heading,
    },

    sectionSubtitle: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
    },

    viewAllBtn: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    viewAllText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '700',
    },

    // =========================
    // DECK CARD
    // =========================

    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: spacing.sm + 4,
      ...Platform.select({
        ios: {
          shadowColor: '#2E1065',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
        },
        android: {
          elevation: 2,
        },
      }),
    },

    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cardInfo: {
      flex: 1,
      marginLeft: 14,
      justifyContent: 'center',
    },

    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.heading,
      letterSpacing: -0.2,
    },

    cardSubtitle: {
      fontSize: 13,
      color: colors.muted,
      marginTop: 3,
      fontWeight: '500',
    },

    // =========================
    // EMPTY
    // =========================

    empty: {
      alignItems: 'center',
      paddingTop: 38,
      paddingHorizontal: 25,
    },

    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor:
        colors.primary + '16',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },

    emptyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.heading,
    },

    emptyText: {
      color: colors.muted,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 5,
      textAlign: 'center',
      maxWidth: 280,
    },

    emptyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 11,
      borderRadius: radius.pill,
      marginTop: 17,
    },

    emptyButtonText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '700',
    },
  });