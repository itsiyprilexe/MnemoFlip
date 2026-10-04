import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { StyledTextInput } from '../components/StyledTextInput';
import { colors, radius, spacing } from '../theme';
import { useStorage } from '../context/StorageContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Deck'>;

export const DeckScreen: React.FC<Props> = ({ route, navigation }) => {
  const { deckId } = route.params;

  const { decks, highScores, renameDeck, deleteDeck, addCard, deleteCard } =
    useStorage();

  const deck = decks.find((d) => d.id === deckId);

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [showCards, setShowCards] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  if (!deck) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.name}>Deck not found</Text>
          <PrimaryButton
            title="Go back"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 14 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const count = deck.cards.length;

  const scores = highScores.filter((s) => s.deckId === deck.id);
  const bestScore = scores.length
    ? Math.max(...scores.map((s) => s.score))
    : null;

  const later = (fn: () => void) => {
    setOptionsOpen(false);
    setTimeout(fn, 300);
  };

  const handleStudy = () => {
    if (deck.cards.length === 0) {
      Alert.alert('No cards yet', 'This deck has no flashcards yet.');
      return;
    }
    navigation.navigate('Quiz', { deckId: deck.id });
  };

  const handleAddCardPress = () => {
    setAddCardOpen(true);
  };

  const openEdit = () => {
    setTitle(deck.title);
    setDescription(deck.description ?? '');
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!title.trim()) {
      return Alert.alert('Validation Error', 'Deck title is required');
    }
    renameDeck(deck.id, title.trim(), (description ?? '').trim());
    setEditOpen(false);
  };

  const handleAddCard = () => {
    if (!question.trim() || !answer.trim()) {
      return Alert.alert('Validation Error', 'Both question and answer are required.');
    }
    addCard(deck.id, question.trim(), answer.trim());
    setQuestion('');
    setAnswer('');
    setAddCardOpen(false);
  };

  const confirmDelete = () =>
    Alert.alert(
      'Delete Deck',
      `Delete "${deck.title}" and all its cards?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteDeck(deck.id);
            navigation.goBack();
          },
        },
      ],
    );

  const confirmDeleteCard = (cardId: string) =>
    Alert.alert('Delete card', 'Remove this card from the deck?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteCard(deck.id, cardId),
      },
    ]);

  return (
    <SafeAreaView style={styles.safe}>







      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={styles.iconNavBtn}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.heading}
          />
        </TouchableOpacity>

        <Text style={styles.topBarTitle} numberOfLines={1}>
          {deck.title}
        </Text>

        <TouchableOpacity
          onPress={() => setOptionsOpen(true)}
          hitSlop={12}
          style={styles.iconNavBtn}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={22}
            color={colors.heading}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >











        {/* =========================
            DECK HERO SUMMARY CARD
        ========================= */}
        <View style={styles.heroCard}>
          <View style={styles.iconTile}>
            <Ionicons
              name="layers-outline"
              size={40}
              color={colors.primary}
            />
          </View>

          <Text style={styles.name}>{deck.title}</Text>

          {!!deck.description && (
            <Text style={styles.descText}>{deck.description}</Text>
          )}

          <View style={styles.badgeRow}>
            <View style={styles.statPill}>
              <Ionicons name="albums-outline" size={14} color={colors.primary} />
              <Text style={styles.statPillText}>
                {count} {count === 1 ? 'card' : 'cards'}
              </Text>
            </View>
            {bestScore !== null && (
              <View style={[styles.statPill, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="trophy-outline" size={14} color="#10B981" />
                <Text style={[styles.statPillText, { color: '#10B981' }]}>
                  Best: {bestScore} pts
                </Text>
              </View>
            )}
          </View>














          {/* Action Buttons in Hero Card */}
          <View style={styles.cardActionsRow}>
            <TouchableOpacity
              style={styles.studyMainBtn}
              onPress={handleStudy}
              activeOpacity={0.8}
            >
              <Ionicons name="play" size={18} color="#FFFFFF" />
              <Text style={styles.studyMainBtnText}>Study Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addCardBtn}

              onPress={() => Alert.alert('Add Card', 'This feature is not implemented yet.')}              activeOpacity={0.8}
            >
              <Ionicons name="add" size={18} color={colors.primary} />
              <Text style={styles.addCardBtnText}>Add Card</Text>
            </TouchableOpacity>
          </View>
        </View>














        {/* =========================
            FLASHCARDS LIST SECTION
        ========================= */}
        <TouchableOpacity
          style={styles.sectionRow}
          activeOpacity={0.7}
          onPress={() => setShowCards((v) => !v)}
        >
          <View style={styles.sectionRowLeft}>
            <Ionicons
              name="albums-outline"
              size={22}
              color={colors.primary}
            />
            <Text style={styles.sectionRowTitle}>Flashcards in Deck</Text>
            <View style={styles.countChip}>
              <Text style={styles.countChipText}>{count}</Text>
            </View>
          </View>

          <Ionicons
            name={showCards ? 'chevron-down' : 'chevron-forward'}
            size={18}
            color={colors.muted}
          />
        </TouchableOpacity>

        {showCards && (
          <View style={styles.cardList}>
            {count === 0 ? (
              <View style={styles.emptyCardBox}>
                <Ionicons
                  name="library-outline"
                  size={32}
                  color={colors.muted}
                />
                <Text style={styles.emptyCardTitle}>No cards yet</Text>
                <Text style={styles.emptyCardSub}>
                  Tap &quot;Add Card&quot; above to create your first flashcard.
                </Text>
              </View>
            ) : (
              deck.cards.map((c, i) => (
                <View key={c.id} style={styles.cardItem}>
                  <View style={styles.cardNumberBadge}>
                    <Text style={styles.cardNumberText}>{i + 1}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardQText}>{c.question}</Text>
                    <View style={styles.answerBox}>
                      <Text style={styles.cardAText}>{c.answer}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => confirmDeleteCard(c.id)}
                    hitSlop={10}
                    style={styles.deleteCardBtn}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color="#EF4444"
                    />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>









      {/* ── ADD CARD MODAL ─────────────────────────────────────────── */}
      <Modal
        visible={addCardOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setAddCardOpen(false)}
      >
        
        <Pressable
          style={styles.overlay}
          onPress={() => setAddCardOpen(false)}
        >
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.grab} />
            <Text style={styles.sheetTitle}>New Flashcard</Text>

            <StyledTextInput
              label="Question"
              value={question}
              onChangeText={setQuestion}
              placeholder="e.g. What is photosynthesis?"
              multiline
            />

            <StyledTextInput
              label="Answer"
              value={answer}
              onChangeText={setAnswer}
              placeholder="e.g. Process used by plants to convert light into energy."
              multiline
            />

            <View style={styles.modalButtons}>
              <PrimaryButton
                title="Cancel"
                variant="secondary"
                onPress={() => setAddCardOpen(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <PrimaryButton
                title="Add Card"
                onPress={handleAddCard}
                style={{ flex: 1 }}
              />




              
            </View>
          </Pressable>
        </Pressable>
      </Modal>


















      {/* ── OPTIONS MODAL ─────────────────────────────────────────── */}
      <Modal
        visible={optionsOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setOptionsOpen(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setOptionsOpen(false)}
        >
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.grab} />
            <Text style={styles.sheetTitle}>Deck Options</Text>

            <SheetItem
              icon="add-circle-outline"
              label="Add New Card"
              onPress={() => later(handleAddCardPress)}
            />

            <SheetItem
              icon="create-outline"
              label="Edit Deck Details"
              onPress={() => later(openEdit)}
            />

            <SheetItem
              icon="trash-outline"
              label="Delete Deck"
              danger
              onPress={() => later(confirmDelete)}
            />
          </Pressable>
        </Pressable>
      </Modal>











      {/* ── EDIT DECK MODAL ───────────────────────────────────────── */}
      <Modal
        visible={editOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setEditOpen(false)}
      >
        <View style={styles.editOverlay}>
          <View style={styles.editBox}>
            <Text style={styles.sheetTitle}>Edit Deck Details</Text>

            <StyledTextInput
              label="Deck Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Deck title"
            />

            <StyledTextInput
              label="Description (Optional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Short description..."
            />

            <View style={styles.editButtons}>
              <PrimaryButton
                title="Cancel"
                variant="secondary"
                onPress={() => setEditOpen(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <PrimaryButton
                title="Save"
                onPress={saveEdit}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const SheetItem = ({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  danger?: boolean;
}) => (
  <TouchableOpacity
    style={styles.sheetItem}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <Ionicons
      name={icon}
      size={22}
      color={danger ? colors.danger : colors.primary}
    />
    <Text style={[styles.sheetLabel, danger && { color: colors.danger }]}>
      {label}
    </Text>
  </TouchableOpacity>
);




















export default DeckScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  topBarTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: colors.heading,
    textAlign: 'center',
    marginHorizontal: 12,
  },

  iconNavBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },

  // ── HERO SUMMARY CARD ─────────────────────────────────────────────────────
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#2E1065',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
      },
      android: { elevation: 3 },
    }),
  },

  iconTile: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.heading,
    textAlign: 'center',
  },

  descText: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    maxWidth: 280,
  },

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },

  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },

  statPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },

  cardActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 18,
  },

  studyMainBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.pill,
  },

  studyMainBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius.pill,
  },

  addCardBtnText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },

  // ── FLASHCARDS SECTION ────────────────────────────────────────────────────
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: spacing.sm,
  },

  sectionRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  sectionRowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
  },

  countChip: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },

  countChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },

  cardList: {
    gap: 10,
    marginBottom: spacing.md,
  },

  emptyCardBox: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
  },

  emptyCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
    marginTop: 8,
  },

  emptyCardSub: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
    textAlign: 'center',
  },

  cardItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#2E1065',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: { elevation: 1 },
    }),
  },

  cardNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  cardNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },

  cardQText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
    lineHeight: 20,
  },

  answerBox: {
    backgroundColor: colors.inputBg,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 8,
  },

  cardAText: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '500',
    lineHeight: 18,
  },

  deleteCardBtn: {
    padding: 4,
    marginTop: 2,
  },

  // ── MODALS ────────────────────────────────────────────────────────────────
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 27, 75, 0.45)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },

  grab: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.heading,
    marginBottom: spacing.md,
  },

  modalButtons: {
    flexDirection: 'row',
    marginTop: 12,
  },

  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: spacing.sm,
    backgroundColor: colors.bg,
  },

  sheetLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.heading,
  },

  editOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 27, 75, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },

  editBox: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },

  editButtons: {
    flexDirection: 'row',
    marginTop: 12,
  },
});