import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../types';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing, accents } from '../theme';

const ICONS = [
  'school',
  'flask',
  'calculator',
  'book',
  'leaf',
  'color-palette',
] as const;

export const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const decks: any[] = [];
  const deleteDeck = (id: string) => {};

  const [query, setQuery] = useState('');

  // Total number of cards
  const totalCards = useMemo(
    () =>
      decks.reduce(
        (sum, deck) => sum + deck.cards.length,
        0
      ),
    [decks]
  );

  // Search decks
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return q
      ? decks.filter((deck) =>
          deck.title.toLowerCase().includes(q)
        )
      : decks;
  }, [decks, query]);

  // Delete deck
  const handleDeleteDeck = (
    id: string,
    name: string
  ) => {
    Alert.alert(
      'Delete deck',
      `Delete "${name}" and all its cards?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteDeck(id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 110,
          },
        ]}

        // =========================
        // HOME HEADER
        // =========================
        ListHeaderComponent={
          <View style={styles.header}>

            {/* Greeting */}
            <View style={styles.greetingRow}>
              <View>
                <Text style={styles.greeting}>
                  Hello, Student!
                </Text>

                <Text style={styles.greetingSubtitle}>
                  Ready to study today?
                </Text>
              </View>

              <View style={styles.profile} >
                <TouchableOpacity
                  onPress = {() => alert("Need to link waray ka set")}
                >
                   <Ionicons
                  name="person"
                  size={20}
                  color={colors.primary}
                />
                </TouchableOpacity>

              </View>
            </View>

            {/* Search */}
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

            {/* Learning Banner */}
            <View style={styles.banner}>
              <View style={styles.bannerContent}>

                <Text style={styles.bannerLabel}>
                  KEEP LEARNING
                </Text>

                <Text style={styles.bannerTitle}>
                  Build your knowledge
                </Text>

                <Text style={styles.bannerText}>
                  Study your flashcards, review your
                  decks, and test yourself with quizzes.
                </Text>
              </View>

              <View style={styles.bannerDecorationOne} />
              <View style={styles.bannerDecorationTwo} />
            </View>

            {/* Statistics */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIcon,
                    {
                      backgroundColor:
                        colors.primary + '18',
                    },
                  ]}
                >
                  <Ionicons
                    name="library-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>

                <View>
                  <Text style={styles.statNumber}>
                    {decks.length}
                  </Text>

                  <Text style={styles.statLabel}>
                    {decks.length === 1
                      ? 'Deck'
                      : 'Decks'}
                  </Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIcon,
                    {
                      backgroundColor:
                        '#F59E0B18',
                    },
                  ]}
                >
                  <Ionicons
                    name="albums-outline"
                    size={20}
                    color="#F59E0B"
                  />
                </View>

                <View>
                  <Text style={styles.statNumber}>
                    {totalCards}
                  </Text>

                  <Text style={styles.statLabel}>
                    {totalCards === 1
                      ? 'Card'
                      : 'Cards'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Deck Section */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.section}>
                  My Decks
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Continue where you left off
                </Text>
              </View>

              {decks.length > 0 && (
                <TouchableOpacity
                  style={styles.viewAllBtn}
                  onPress={() =>
                    (navigation as any).navigate('DecksTab')
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewAllText}>
                    View all
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={15}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        }

        // =========================
        // DECKS
        // =========================
        renderItem={({ item, index }) => {
          const accent =
            accents[index % accents.length];

          const count = item.cards.length;
          const isEmpty = count === 0;

          return (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('Deck', {
                  deckId: item.id,
                })
              }
              onLongPress={() =>
                handleDeleteDeck(
                  item.id,
                  item.title
                )
              }
            >
              {/* Icon */}
              <View
                style={[
                  styles.tile,
                  {
                    backgroundColor:
                      accent + '26',
                  },
                ]}
              >
                <Ionicons
                  name={
                    ICONS[
                      index % ICONS.length
                    ]
                  }
                  size={22}
                  color={accent}
                />
              </View>

              {/* Deck Info */}
              <View style={styles.deckBody}>
                <Text
                  style={styles.deckTitle}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                <Text style={styles.deckMeta}>
                  {isEmpty
                    ? 'No cards yet'
                    : `${count} ${
                        count === 1
                          ? 'card'
                          : 'cards'
                      }`}
                </Text>
              </View>

              {/* Open */}
              <View
                style={[
                  styles.openBtn,
                  isEmpty
                    ? styles.openBtnEmpty
                    : {
                        backgroundColor:
                          colors.primary,
                      },
                ]}
              >
                <Ionicons
                  name={
                    isEmpty
                      ? 'add'
                      : 'chevron-forward'
                  }
                  size={isEmpty ? 20 : 17}
                  color={
                    isEmpty
                      ? colors.muted
                      : '#FFFFFF'
                  }
                />
              </View>
            </TouchableOpacity>
          );
        }}

        // =========================
        // EMPTY
        // =========================
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name={
                  query
                    ? 'search-outline'
                    : 'library-outline'
                }
                size={30}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              {query
                ? 'No decks found'
                : 'No decks yet'}
            </Text>

            <Text style={styles.emptyText}>
              {query
                ? 'Try searching for another deck.'
                : 'Go to the Decks tab and create your first study set.'}
            </Text>

            {!query && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() =>
                  (navigation as any).navigate('DecksTab')
                }
              >
                <Ionicons
                  name="add"
                  size={18}
                  color="#FFFFFF"
                />

                <Text style={styles.emptyButtonText}>
                  Create a deck
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
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

    list: {
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

    bannerDecorationOne: {
      position: 'absolute',
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor:
        'rgba(255,255,255,0.08)',
      right: -30,
      top: -30,
    },

    bannerDecorationTwo: {
      position: 'absolute',
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor:
        'rgba(255,255,255,0.07)',
      right: 35,
      bottom: -30,
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
    // DECK ROW
    // =========================

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth:
        StyleSheet.hairlineWidth,
      borderColor: colors.border,
      padding: spacing.sm + 4,
      marginBottom: spacing.sm + 2,
      gap: spacing.sm,
    },

    tile: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },

    deckBody: {
      flex: 1,
      marginLeft: 2,
    },

    deckTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.heading,
    },

    deckMeta: {
      fontSize: 13,
      color: colors.muted,
      marginTop: 2,
    },

    openBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
    },

    openBtnEmpty: {
      borderWidth: 1,
      borderColor: colors.border,
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