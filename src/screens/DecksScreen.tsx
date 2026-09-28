import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useDecks } from '../context/DeckContext';
import { colors, radius, spacing, accents } from '../theme';

const ICONS = ['school', 'flask', 'calculator', 'book', 'leaf', 'color-palette'] as const;

export const DecksScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { decks } = useDecks();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? decks.filter((d) => d.title.toLowerCase().includes(q)) : decks;
  }, [decks, query]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
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
        }
        renderItem={({ item, index }) => {
          const accent = accents[index % accents.length];
          return (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Deck', { deckId: item.id })}
            >
              <View style={[styles.tile, { backgroundColor: accent + '26' }]}>
                <Ionicons name={ICONS[index % ICONS.length]} size={24} color={accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.meta}>{item.cards.length} cards</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.muted} />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="library-outline" size={48} color={colors.muted} style={{ marginBottom: spacing.sm }} />
            <Text style={styles.emptyTitle}>{query ? 'No matches' : 'No decks yet'}</Text>
            {!query && <Text style={styles.emptyText}>Create your first deck from the Home tab.</Text>}
          </View>
        }
      />
    </View>
  );
};

export default DecksScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.text },
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
  title: { fontSize: 15, fontWeight: '700', color: colors.heading },
  meta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.heading },
  emptyText: { color: colors.muted, marginTop: 4, textAlign: 'center' },
});