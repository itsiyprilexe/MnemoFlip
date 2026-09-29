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
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { StyledTextInput } from '../components/StyledTextInput';
import { useTheme } from '../context/ThemeContext';
import { useDecks } from '../context/DeckContext';
import { radius, spacing, accents } from '../theme';

const ICONS = [
  'school',
  'flask',
  'calculator',
  'book',
  'leaf',
  'color-palette',
] as const;

export const DecksScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { decks, createDeck, deleteDeck } = useDecks();

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Close and reset modal
  const closeModal = useCallback(() => {
    setTitle('');
    setDescription('');
    setModalVisible(false);
  }, []);

  // Create new deck
  const handleCreateDeck = () => {
    if (!title.trim()) {
      return Alert.alert(
        'Validation Error',
        'Deck title is required'
      );
    }

    const id = createDeck(
      title.trim(),
      description.trim()
    );

    closeModal();

    if (id) {
      navigation.navigate('Deck', {
        deckId: id,
      });
    }
  };

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

  const countLabel = `${decks.length} ${
    decks.length === 1 ? 'deck' : 'decks'
  }`;

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom:
              insets.bottom + 110,
          },
        ]}

        // HEADER
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.section}>
                Your decks
              </Text>

              <Text style={styles.subtitle}>
                {countLabel}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addBtn}
              onPress={() =>
                setModalVisible(true)
              }
              activeOpacity={0.8}
            >
              <Ionicons
                name="add"
                size={20}
                color="#FFFFFF"
              />

              <Text style={styles.addBtnText}>
                New deck
              </Text>
            </TouchableOpacity>
          </View>
        }

        // DECK CARDS
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
              {/* Deck Icon */}
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

              {/* Deck Information */}
              <View style={styles.body}>
                <Text
                  style={styles.title}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                <Text style={styles.meta}>
                  {isEmpty
                    ? 'No cards yet'
                    : `${count} ${
                        count === 1
                          ? 'card'
                          : 'cards'
                      }`}
                </Text>
              </View>

              {/* Delete */}
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() =>
                  handleDeleteDeck(
                    item.id,
                    item.title
                  )
                }
                hitSlop={6}
                accessibilityLabel={`Delete ${item.title}`}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={
                    colors.danger ??
                    '#EF4444'
                  }
                />
              </TouchableOpacity>

              {/* Open Deck */}
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
                  size={isEmpty ? 20 : 18}
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

        // EMPTY STATE
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="library-outline"
              size={48}
              color={colors.muted}
              style={{
                marginBottom: spacing.sm,
              }}
            />

            <Text style={styles.emptyTitle}>
              No decks yet
            </Text>

            <Text style={styles.emptyText}>
              Tap "New deck" to create your
              first study set.
            </Text>
          </View>
        }
      />

      {/* CREATE DECK BOTTOM SHEET */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >
          {/* Tap outside to close */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeModal}
          />

          <View
            style={[
              styles.sheet,
              {
                paddingBottom:
                  Math.max(
                    insets.bottom,
                    16
                  ) + 12,
              },
            ]}
          >
            {/* Handle */}
            <View style={styles.handle} />

            <Text style={styles.modalTitle}>
              New deck
            </Text>

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
                style={{
                  flex: 1,
                  marginRight: 8,
                }}
              />

              <PrimaryButton
                title="Create deck"
                onPress={handleCreateDeck}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default DecksScreen;

const createStyles = (
  colors: ReturnType<
    typeof useTheme
  >['colors']
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },

    list: {
      padding: spacing.md,
    },

    // =========================
    // HEADER
    // =========================

    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
      paddingHorizontal: 4,
    },

    section: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.heading,
      letterSpacing: -0.3,
    },

    subtitle: {
      fontSize: 13,
      color: colors.muted,
      marginTop: 2,
      fontWeight: '600',
    },

    addBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.primary,
      paddingLeft: 12,
      paddingRight: 16,
      paddingVertical: 10,
      borderRadius: radius.pill,
    },

    addBtnText: {
      color: '#FFFFFF',
      fontSize: 14,
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

    body: {
      flex: 1,
      marginLeft: 2,
    },

    title: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.heading,
    },

    meta: {
      fontSize: 13,
      color: colors.muted,
      marginTop: 2,
    },

    iconBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    openBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 2,
    },

    openBtnEmpty: {
      borderWidth: 1,
      borderColor: colors.border,
    },

    // =========================
    // EMPTY STATE
    // =========================

    empty: {
      alignItems: 'center',
      marginTop: 40,
    },

    emptyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.heading,
    },

    emptyText: {
      color: colors.muted,
      marginTop: 4,
      textAlign: 'center',
    },

    // =========================
    // BOTTOM SHEET
    // =========================

    modalOverlay: {
      flex: 1,
      backgroundColor:
        'rgba(30,27,75,0.5)',
      justifyContent: 'flex-end',
    },

    sheet: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 10,
    },

    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginBottom: 14,
    },

    modalTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.heading,
      marginBottom: 12,
    },

    modalButtons: {
      flexDirection: 'row',
      marginTop: 12,
    },
  });