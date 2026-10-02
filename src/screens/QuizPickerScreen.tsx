import React, { useCallback, useMemo, useState } from 'react';
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
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { StyledTextInput } from '../components/StyledTextInput';
import { useTheme } from '../context/ThemeContext';
import { useStorage } from '../context/StorageContext';
import { radius, spacing } from '../theme';

const BLUE = '#4990E3';

const ICONS = [
  'school',
  'flask',
  'calculator',
  'book',
  'leaf',
  'color-palette',
] as const;

export const QuizPickerScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { quizzes, createQuiz, renameQuiz, deleteQuiz } = useStorage();

  // ── Create Modal ─────────────────────────────────────────────────────────────
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const closeCreateModal = useCallback(() => {
    setTitle('');
    setDescription('');
    setCreateModalVisible(false);
  }, []);

  const handleCreate = () => {
    if (!title.trim()) {
      return Alert.alert('Validation Error', 'Quiz title is required');
    }
    const id = createQuiz(title.trim(), description.trim());
    closeCreateModal();
    navigation.navigate('QuizEditor', { quizId: id });
  };

  // ── Edit Modal ────────────────────────────────────────────────────────────────
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editId, setEditId] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const openEditModal = useCallback(
    (id: string, currentTitle: string, currentDesc: string) => {
      setEditId(id);
      setEditTitle(currentTitle);
      setEditDescription(currentDesc);
      setEditModalVisible(true);
    },
    [],
  );

  const closeEditModal = useCallback(() => {
    setEditId('');
    setEditTitle('');
    setEditDescription('');
    setEditModalVisible(false);
  }, []);

  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      return Alert.alert('Validation Error', 'Quiz title is required');
    }
    renameQuiz(editId, editTitle.trim(), editDescription.trim());
    closeEditModal();
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const confirmDelete = (quizId: string, name: string) =>
    Alert.alert('Delete quiz', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteQuiz(quizId),
      },
    ]);

  // ── Play / Navigate ───────────────────────────────────────────────────────────
  const handleRowPress = (quizId: string, count: number) => {
    if (count === 0) {
      Alert.alert(
        'This section is incomplete hehehe',
        'Add some questions first before starting the quiz.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Add Questions',
            onPress: () => navigation.navigate('QuizEditor', { quizId }),
          },
        ],
      );
      return;
    }
    navigation.navigate('Quiz', { quizId });
  };

  const countLabel = `${quizzes.length} ${
    quizzes.length === 1 ? 'quiz' : 'quizzes'
  }`;

  return (
    <View style={styles.container}>
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 110 },
        ]}
        showsVerticalScrollIndicator={false}

        // ── HEADER ─────────────────────────────────────────────────────────────
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.section}>Your quizzes</Text>
              <Text style={styles.subtitle}>{countLabel}</Text>
            </View>

            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setCreateModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addBtnText}>New quiz</Text>
            </TouchableOpacity>
          </View>
        }

        // ── QUIZ ROW ───────────────────────────────────────────────────────────
        renderItem={({ item, index }) => {
          const count = item.questions.length;
          const isEmpty = count === 0;

          return (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={() => handleRowPress(item.id, count)}
            >
              {/* Icon Tile */}
              <View style={styles.tile}>
                <Ionicons
                  name={ICONS[index % ICONS.length]}
                  size={22}
                  color={BLUE}
                />
              </View>

              {/* Quiz Info */}
              <View style={styles.body}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.meta}>
                  {isEmpty
                    ? 'No questions yet'
                    : `${count} ${count === 1 ? 'question' : 'questions'}`}
                </Text>
              </View>

              {/* Edit */}
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() =>
                  openEditModal(item.id, item.title, item.description)
                }
                hitSlop={6}
                accessibilityLabel={`Edit ${item.title}`}
              >
                <Ionicons name="create-outline" size={18} color={BLUE} />
              </TouchableOpacity>

              {/* Delete */}
              <TouchableOpacity
                style={styles.iconBtnDanger}
                onPress={() => confirmDelete(item.id, item.title)}
                hitSlop={6}
                accessibilityLabel={`Delete ${item.title}`}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>

              {/* Play / Add */}
              <TouchableOpacity
                style={[
                  styles.playBtn,
                  isEmpty ? styles.playBtnEmpty : styles.playBtnActive,
                ]}
                onPress={() => {
                  if (isEmpty) {
                    navigation.navigate('QuizEditor', { quizId: item.id });
                  } else {
                    navigation.navigate('Quiz', { quizId: item.id });
                  }
                }}
                hitSlop={4}
              >
                <Ionicons
                  name={isEmpty ? 'add' : 'play'}
                  size={isEmpty ? 20 : 16}
                  color={isEmpty ? BLUE : '#FFFFFF'}
                  style={isEmpty ? undefined : { marginLeft: 2 }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}

        // ── EMPTY STATE ────────────────────────────────────────────────────────
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="document-text-outline"
              size={48}
              color={BLUE}
              style={{ marginBottom: spacing.sm }}
            />
            <Text style={styles.emptyTitle}>No quizzes yet</Text>
            <Text style={styles.emptyText}>
              Tap &quot;New quiz&quot; to make your first one.
            </Text>
          </View>
        }
      />

      {/* ── CREATE QUIZ BOTTOM SHEET ──────────────────────────────────────────── */}
      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeCreateModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeCreateModal} />
          <View
            style={[
              styles.sheet,
              { paddingBottom: Math.max(insets.bottom, 16) + 12 },
            ]}
          >
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>New quiz</Text>

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
                onPress={closeCreateModal}
                variant="secondary"
                style={{ flex: 1, marginRight: 8 }}
              />
              <PrimaryButton
                title="Create quiz"
                onPress={handleCreate}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── EDIT QUIZ BOTTOM SHEET ────────────────────────────────────────────── */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeEditModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeEditModal} />
          <View
            style={[
              styles.sheet,
              { paddingBottom: Math.max(insets.bottom, 16) + 12 },
            ]}
          >
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Edit quiz</Text>

            <StyledTextInput
              label="Quiz Title"
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="e.g. Biology Basics"
            />
            <StyledTextInput
              label="Description (Optional)"
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Short description..."
            />

            <View style={styles.modalButtons}>
              <PrimaryButton
                title="Cancel"
                onPress={closeEditModal}
                variant="secondary"
                style={{ flex: 1, marginRight: 8 }}
              />
              <PrimaryButton
                title="Save changes"
                onPress={handleSaveEdit}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default QuizPickerScreen;

const createStyles = (
  colors: ReturnType<typeof useTheme>['colors'],
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },

    list: {
      padding: spacing.md,
    },

    // ── HEADER ──────────────────────────────────────────────────────────────────

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
      backgroundColor: BLUE,
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

    // ── QUIZ ROW ────────────────────────────────────────────────────────────────

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
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
      backgroundColor: '#EAF4FF',
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

    iconBtnDanger: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderWidth: 1,
      borderColor: '#FECACA',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FEF2F2',
    },

    playBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 2,
    },

    playBtnActive: {
      backgroundColor: BLUE,
    },

    playBtnEmpty: {
      borderWidth: 1,
      borderColor: BLUE,
      backgroundColor: '#EAF4FF',
    },

    // ── EMPTY STATE ──────────────────────────────────────────────────────────────

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

    // ── BOTTOM SHEET ─────────────────────────────────────────────────────────────

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
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
      backgroundColor: BLUE,
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