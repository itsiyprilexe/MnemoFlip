import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useDecks } from '../context/DeckContext';
import { colors, radius, spacing, accents } from '../theme';

const ICONS = ['school', 'flask', 'calculator', 'book', 'leaf', 'color-palette'] as const;

export const QuizPickerScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { decks } = useDecks();

  const start = (deckId: string, count: number) => {
    if (count === 0) {
      return Alert.alert('No cards', 'Add some cards to this deck before taking a quiz.');
    }
    navigation.navigate('Quiz', { deckId });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => {
          const accent = accents[index % accents.length];
          return (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={() => start(item.id, item.cards.length)}
            >
              <View style={[styles.tile, { backgroundColor: accent + '26' }]}>
                <Ionicons name={ICONS[index % ICONS.length]} size={24} color={accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.meta}>{item.cards.length} cards</Text>
              </View>
              <Ionicons name="play-circle" size={28} color={colors.primary} />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={48} color={colors.muted} style={{ marginBottom: spacing.sm }} />
            <Text style={styles.emptyTitle}>No decks to quiz yet</Text>
            <Text style={styles.emptyText}>Create a deck from the Home tab first.</Text>
          </View>
        }
      />
    </View>
  );
};

export default QuizPickerScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 4,
    marginBottom: spacing.sm + 4,
    gap: spacing.md,
  },
  tile: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '700', color: colors.heading },
  meta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.heading },
  emptyText: { color: colors.muted, marginTop: 4, textAlign: 'center' },
});