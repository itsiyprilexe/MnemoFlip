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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { StyledTextInput } from '../components/StyledTextInput';
import { colors, radius, spacing, shadow } from '../theme';
import { useStorage } from '../context/StorageContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Deck'>;

const BLUE = '#4990E3';
const BLUE_SOFT = '#EAF4FF';
const DANGER = '#DC2626';

export const DeckScreen: React.FC<Props> = ({ route, navigation }) => {
  const { deckId } = route.params;

  const { decks, highScores, renameDeck, deleteDeck, deleteCard } = useStorage();

  const deck = decks.find((d) => d.id === deckId);

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!deck) {
    return (
      <View style={styles.center}>
        <Text style={styles.name}>Deck not found</Text>

        <PrimaryButton
          title="Go back"
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const count = deck.cards.length;

  const scores = highScores.filter(
    (s) => s.deckId === deck.id
  );

  const best = scores.length
    ? scores.reduce((a, b) =>
        b.score > a.score ? b : a
      )
    : null;

  const later = (fn: () => void) => {
    setOptionsOpen(false);
    setTimeout(fn, 300);
  };

  const needCards = (go: () => void) => {
    if (count === 0) {
      return Alert.alert(
        'No cards yet',
        'Add some cards to this deck first.'
      );
    }

    go();
  };

  const openEdit = () => {
    setTitle(deck.title);
    setDescription(deck.description ?? '');
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!title.trim()) {
      return Alert.alert(
        'Validation Error',
        'Deck title is required'
      );
    }

    renameDeck(deck.id, title.trim(), (description ?? '').trim());

    setEditOpen(false);
  };

  const confirmDelete = () =>
    Alert.alert(
      'Delete Deck',
      `Delete "${deck.title}" and all its cards?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteDeck(deck.id);
            navigation.goBack();
          },
        },
      ]
    );

  const confirmDeleteCard = (cardId: string) =>
    Alert.alert(
      'Delete card',
      'Remove this card from the deck?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            deleteCard(deck.id, cardId),
        },
      ]
    );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={12}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={colors.heading}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setOptionsOpen(true)}
          hitSlop={12}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={26}
            color={colors.heading}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconTile}>
          <Ionicons
            name="layers-outline"
            size={52}
            color={BLUE}
          />
        </View>

        <Text style={styles.name}>
          {deck.title}
        </Text>

        <Text style={styles.count}>
          {count} {count === 1 ? 'card' : 'cards'}
        </Text>

        <View style={styles.actions}>
          <View style={styles.action}>
            <View style={styles.circle}>
              <Ionicons
                name="play"
                size={30}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.actionLabel}>
              Study
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onPress={() =>
            setShowCards((v) => !v)
          }
        >
          <Ionicons
            name="albums-outline"
            size={26}
            color={BLUE}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>
              Flashcards
            </Text>

            <Text style={styles.rowMeta}>
              {count}{' '}
              {count === 1 ? 'card' : 'cards'}
            </Text>
          </View>

          <Ionicons
            name={
              showCards
                ? 'chevron-down'
                : 'chevron-forward'
            }
            size={20}
            color={colors.muted}
          />
        </TouchableOpacity>

        {showCards && (
          <View style={styles.cardList}>
            {count === 0 ? (
              <Text style={styles.rowMeta}>
                No cards yet. Open the ••• menu and tap Add Cards.
              </Text>
            ) : (
              deck.cards.map((c: any) => (
                <View
                  key={c.id}
                  style={styles.cardItem}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardQ}>
                      {c.question}
                    </Text>

                    <Text style={styles.cardA}>
                      {c.answer}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      confirmDeleteCard(c.id)
                    }
                    hitSlop={10}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={DANGER}
                    />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={optionsOpen}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setOptionsOpen(false)
        }
      >
        <Pressable
          style={styles.overlay}
          onPress={() =>
            setOptionsOpen(false)
          }
        >
          <Pressable
            style={styles.sheet}
            onPress={() => {}}
          >
            <View style={styles.grab} />

            <Text style={styles.sheetTitle}>
              Deck Options
            </Text>

            <SheetItem
              icon="create-outline"
              label="Edit Deck Details"
              onPress={() =>
                later(openEdit)
              }
            />



            <SheetItem
              icon="trash-outline"
              label="Delete Deck"
              danger
              onPress={() =>
                later(confirmDelete)
              }
            />
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={editOpen}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setEditOpen(false)
        }
      >
        <View style={styles.editOverlay}>
          <View style={styles.editBox}>
            <Text style={styles.sheetTitle}>
              Edit Deck Details
            </Text>

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
                onPress={() =>
                  setEditOpen(false)
                }
                style={{
                  flex: 1,
                  marginRight: 8,
                }}
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
      size={24}
      color={
        danger
          ? DANGER
          : BLUE
      }
    />

    <Text
      style={[
        styles.sheetLabel,
        danger && { color: DANGER },
      ]}
    >
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
    backgroundColor: colors.bg,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },

  body: {
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },

  iconTile: {
    width: 108,
    height: 108,
    borderRadius: 28,
    backgroundColor: BLUE_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },

  name: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.heading,
    marginTop: spacing.md,
    textAlign: 'center',
  },

  count: {
    fontSize: 15,
    color: colors.muted,
    marginTop: 4,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: spacing.lg,
  },

  action: {
    alignItems: 'center',
    gap: 8,
  },

  circle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BLUE,
  },

  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BLUE,
  },

  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
  },

  rowTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.heading,
  },

  rowMeta: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },

  cardList: {
    width: '100%',
    marginBottom: spacing.sm + 4,
    gap: 8,
  },

  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    padding: spacing.sm + 4,
  },

  cardQ: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
  },

  cardA: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
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
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: BLUE_SOFT,
    marginBottom: spacing.md,
  },

  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.heading,
    marginBottom: spacing.md,
  },

  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
  },

  sheetLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.heading,
  },

  editOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },

  editBox: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 20,
    ...shadow,
  },

  editButtons: {
    flexDirection: 'row',
    marginTop: 12,
  },
});