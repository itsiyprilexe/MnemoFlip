import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
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

export const QuizPickerScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { decks, createDeck } = useDecks();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const start = (deckId: string, count: number) => {
    if (count === 0) {
      return Alert.alert('No cards', 'Add some cards to this deck before taking a quiz.');
    }
    navigation.navigate('Quiz', { deckId });
  };

  const closeModal = useCallback(() => {
    setTitle('');
    setDescription('');
    setModalVisible(false);
  }, []);

  const handleCreateQuiz = () => {
    if (!title.trim()) {
      return Alert.alert('Validation Error', 'Quiz title is required');
    }
    createDeck(title.trim(), description.trim());
    closeModal();
    Alert.alert('Quiz created', 'Open it from the Decks tab to add cards, then come back to play.');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.section}>Choose a quiz</Text>
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
            <Text style={styles.emptyTitle}>No quizzes yet</Text>
            <Text style={styles.emptyText}>Tap + to create your first quiz.</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Quiz</Text>
            <StyledTextInput
              label="Quiz Title"
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
              <PrimaryButton title="Create Quiz" onPress={handleCreateQuiz} style={{ flex: 1 }} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default QuizPickerScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  section: { fontSize: 18, fontWeight: '800', color: colors.heading },
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
    marginBottom: spacing.sm + 4,
    gap: spacing.md,
  },
  tile: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '700', color: colors.heading },
  meta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.heading },
  emptyText: { color: colors.muted, marginTop: 4, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(30,27,75,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 20, ...shadow },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.heading, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', marginTop: 12 },
});