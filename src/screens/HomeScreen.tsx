import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useDecks } from '../context/DeckContext';
import { colors, radius, spacing, accents } from '../theme';

const ICONS = ['school', 'flask', 'calculator', 'book', 'leaf', 'color-palette'] as const;

export const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { decks, deleteDeck } = useDecks();
  const [query, setQuery] = useState('');

  const totalCards = useMemo(() => decks.reduce((sum, d) => sum + d.cards.length, 0), [decks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? decks.filter((d) => d.title.toLowerCase().includes(q)) : decks;
  }, [decks, query]);

  const handleDeleteDeck = (id: string, name: string) => {
    Alert.alert('Delete Deck', `Delete "${name}" and all its cards?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteDeck(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.topRow}>
              <Text style={styles.heading}>Hello, Student!</Text>
              <View style={styles.topActions}>
              </View>
            </View>

            <View style={styles.searchWrap}>
              <Ionicons name="search" size={18} color={colors.muted} />
              <TextInput
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
                placeholder="Search decks..."
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={styles.banner}>
              <Text style={styles.bannerTitle}>Keep Learning</Text>
              <Text style={styles.bannerText}>
                {decks.length} {decks.length === 1 ? 'deck' : 'decks'} · {totalCards}{' '}
                {totalCards === 1 ? 'card' : 'cards'}. Take quizzes and improve your knowledge every day.
              </Text>
            </View>

            <Text style={styles.section}>My Decks</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const accent = accents[index % accents.length];
          return (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Deck', { deckId: item.id })}
              onLongPress={() => handleDeleteDeck(item.id, item.title)}
            >
              <View style={[styles.tile, { backgroundColor: accent + '26' }]}>
                <Ionicons name={ICONS[index % ICONS.length]} size={24} color={accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.deckTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.deckMeta}>{item.cards.length} cards</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.muted} />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="library-outline" size={48} color={colors.muted} style={{ marginBottom: spacing.sm }} />
            <Text style={styles.emptyTitle}>{query ? 'No matches' : 'No decks yet'}</Text>
            <Text style={styles.emptyText}>
              {query ? 'Try a different search.' : 'Go to the Decks tab to create your first study set.'}
            </Text>
          </View>
        }
        ListFooterComponent={
          decks.length > 0 ? <Text style={styles.tip}>Tip: long-press a deck to delete it.</Text> : null
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  header: { marginBottom: spacing.sm },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heading: { fontSize: 28, fontWeight: '800', color: colors.heading, lineHeight: 34 },
  topActions: { flexDirection: 'row', gap: 10 },
  roundBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.text },
  banner: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 6 },
  bannerText: { fontSize: 13, color: '#E4E0FF', lineHeight: 19 },
  section: { fontSize: 18, fontWeight: '800', color: colors.heading },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 4,
    marginTop: spacing.sm + 4,
    gap: spacing.md,
  },
  tile: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  deckTitle: { fontSize: 15, fontWeight: '700', color: colors.heading },
  deckMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  tip: { textAlign: 'center', color: colors.muted, fontSize: 12, marginTop: spacing.lg },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.heading },
  emptyText: { color: colors.muted, marginTop: 4, textAlign: 'center' },
});