import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { StyledTextInput } from '../components/StyledTextInput';
import { useDecks } from '../context/DeckContext';
import { colors, radius, spacing, shadow, accents } from '../theme';

const ICONS = ['school', 'flask', 'calculator', 'book', 'leaf', 'color-palette'] as const;

export const DecksScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { decks, createDeck, deleteDeck } = useDecks();
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? decks.filter((d) => d.title.toLowerCase().includes(q)) : decks;
  }, [decks, query]);

  const closeModal = useCallback(() => {
    setTitle('');
    setDescription('');
    setModalVisible(false);
  }, []);

  const handleCreateDeck = () => {
    if (!title.trim()) {
      return Alert.alert('Validation Error', 'Deck title is required');
    }
    const id = createDeck(title.trim(), description.trim());
    closeModal();
    if (id) navigation.navigate('Deck', { deckId: id });
  };

  const handleDeleteDeck = (id: string, name: string) => {
    Alert.alert('Delete Deck', `Delete "${name}" and all its cards?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteDeck(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.headerRow}>
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
            <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
              <Ionicons name="add" size={26} color="#fff" />
            </TouchableOpacity>
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
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.meta}>{item.cards.length} cards</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteDeck(item.id, item.title)} hitSlop={10}>
                <Ionicons name="trash-outline" size={20} color="#DC2626" />
              </TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color={colors.muted} />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="library-outline" size={48} color={colors.muted} style={{ marginBottom: spacing.sm }} />
            <Text style={styles.emptyTitle}>{query ? 'No matches' : 'No decks yet'}</Text>
            <Text style={styles.emptyText}>
              {query ? 'Try a different search.' : 'Tap + to create your first study set.'}
            </Text>
          </View>
        }
        ListFooterComponent={
          decks.length > 0 ? <Text style={styles.tip}>Tip: tap the trash icon or long-press a deck to delete it.</Text> : null
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Deck</Text>
            <StyledTextInput
              label="Deck Title"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Biology Basics"
            />
            <StyledTextInput
              label="Description (Optional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Short description..."
            />
            <View style={styles.modalButtons}>
              <PrimaryButton
                title="Cancel"
                onPress={closeModal}
                variant="secondary"
                style={{ flex: 1, marginRight: 8 }}
              />
              <PrimaryButton title="Create Deck" onPress={handleCreateDeck} style={{ flex: 1 }} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default DecksScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: spacing.xs },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.text },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  tip: { textAlign: 'center', color: colors.muted, fontSize: 12, marginTop: spacing.lg },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.heading },
  emptyText: { color: colors.muted, marginTop: 4, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(30,27,75,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 20, ...shadow },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.heading, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', marginTop: 12 },
});