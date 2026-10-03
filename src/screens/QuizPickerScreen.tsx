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
import { useStorage, Quiz } from '../context/StorageContext';
import { radius, spacing } from '../theme';

const ICONS = [
  'calculator',
  'document-text',
  'school',
  'flask',
  'book',
  'color-palette',
] as const;

export const QuizPickerScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { quizzes, createQuiz, renameQuiz, deleteQuiz } = useStorage();

  // ── 3-Dots Options Menu ─────────────────────────────────────────────────────
  const [menuQuiz, setMenuQuiz] = useState<Quiz | null>(null);

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
  const handleRowPress = () => {
    Alert.alert('Under Construction', 'This feature is coming soon!');
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

          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.7}
              onPress={handleRowPress}
            >
              {/* Left: Icon Circle */}
              <View style={styles.iconCircle}>
                <Ionicons
                  name={ICONS[index % ICONS.length]}
                  size={24}
                  color={colors.primary}
                />
              </View>

              {/* Middle: Title & Subtitle */}
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.cardSubtitle}>
                  {count} {count === 1 ? 'card' : 'cards'}
                </Text>
              </View>

              {/* Right Side: Start Now + Start Quiz pill button & 3-dots */}
              <View style={styles.rightSection}>
                <View style={styles.startActionCol}>
                  <Text style={styles.startNowLabel}>Start Now</Text>
                  <TouchableOpacity
                    style={styles.startQuizBtn}
                    onPress={handleRowPress}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.startQuizBtnText}>Start Quiz</Text>
                  </TouchableOpacity>
                </View>

                {/* 3-Dots Menu Button */}
                <TouchableOpacity
                  style={styles.dotsBtn}
                  onPress={() => setMenuQuiz(item)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  accessibilityLabel={`Options for ${item.title}`}
                >
                  <Ionicons
                    name="ellipsis-vertical"
                    size={20}
                    color={colors.muted}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}

        // ── EMPTY STATE ────────────────────────────────────────────────────────
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="document-text-outline"
              size={48}
              color={colors.primary}
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

            <TouchableOpacity
              style={styles.editQuestionsBtn}
              onPress={() => {
                const targetId = editId;
                closeEditModal();
                navigation.navigate('QuizEditor', { quizId: targetId });
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="list-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.editQuestionsBtnText}>
                Edit Questions & Answers
              </Text>
            </TouchableOpacity>

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

      {/* ── 3-DOTS OPTIONS BOTTOM SHEET ───────────────────────────────────────── */}
      <Modal
        visible={!!menuQuiz}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuQuiz(null)}
      >
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setMenuQuiz(null)}
        >
          <Pressable style={styles.menuSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />

            {menuQuiz && (
              <View style={styles.menuHeader}>
                <Text style={styles.menuQuizTitle} numberOfLines={1}>
                  {menuQuiz.title}
                </Text>
                <Text style={styles.menuSubtitle}>
                  {menuQuiz.questions.length}{' '}
                  {menuQuiz.questions.length === 1 ? 'card' : 'cards'}
                </Text>
              </View>
            )}

            <View style={styles.menuItemsList}>
              {/* Edit Quiz */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  if (!menuQuiz) return;
                  const q = menuQuiz;
                  setMenuQuiz(null);
                  openEditModal(q.id, q.title, q.description);
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.menuItemIconWrap,
                    { backgroundColor: colors.primarySoft },
                  ]}
                >
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.menuItemLabel}>Edit Quiz</Text>
              </TouchableOpacity>

              {/* Delete Quiz */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  if (!menuQuiz) return;
                  const q = menuQuiz;
                  setMenuQuiz(null);
                  confirmDelete(q.id, q.title);
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.menuItemIconWrap,
                    { backgroundColor: '#FEF2F2' },
                  ]}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color="#EF4444"
                  />
                </View>
                <Text style={[styles.menuItemLabel, { color: '#EF4444' }]}>
                  Delete Quiz
                </Text>
              </TouchableOpacity>

              {/* Add Question */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  if (!menuQuiz) return;
                  const q = menuQuiz;
                  setMenuQuiz(null);
                  navigation.navigate('QuizEditor', { quizId: q.id });
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.menuItemIconWrap,
                    { backgroundColor: colors.primarySoft },
                  ]}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.menuItemLabel}>Add Question</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.menuCancelBtn}
              onPress={() => setMenuQuiz(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.menuCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
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

    // ── QUIZ CARD (MATCHING DESIGN) ─────────────────────────────────────────

    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: spacing.sm + 4,
      ...Platform.select({
        ios: {
          shadowColor: '#2E1065',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
        },
        android: {
          elevation: 2,
        },
      }),
    },

    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primarySoft,
    },

    cardInfo: {
      flex: 1,
      marginLeft: 14,
      marginRight: 6,
      justifyContent: 'center',
    },

    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.heading,
      letterSpacing: -0.2,
    },

    cardSubtitle: {
      fontSize: 13,
      color: colors.muted,
      marginTop: 3,
      fontWeight: '500',
    },

    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginLeft: 4,
    },

    startActionCol: {
      alignItems: 'center',
    },

    startNowLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.heading,
      marginBottom: 4,
    },

    startQuizBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },

    startQuizBtnText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '700',
    },

    dotsBtn: {
      width: 32,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 2,
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
      backgroundColor: 'rgba(30,27,75,0.5)',
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

    editQuestionsBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primarySoft,
      paddingVertical: 12,
      borderRadius: radius.md,
      marginTop: 4,
      marginBottom: 6,
    },

    editQuestionsBtnText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '700',
    },

    modalButtons: {
      flexDirection: 'row',
      marginTop: 12,
    },

    // ── 3-DOTS OPTIONS SHEET ──────────────────────────────────────────────────

    menuOverlay: {
      flex: 1,
      backgroundColor: 'rgba(30, 27, 75, 0.45)',
      justifyContent: 'flex-end',
    },

    menuSheet: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 24,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
        },
        android: { elevation: 12 },
      }),
    },

    menuHeader: {
      paddingBottom: 14,
      marginBottom: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },

    menuQuizTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.heading,
      marginBottom: 2,
    },

    menuSubtitle: {
      fontSize: 13,
      color: colors.muted,
      fontWeight: '500',
    },

    menuItemsList: {
      gap: 8,
      marginBottom: 14,
    },

    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: radius.md,
      backgroundColor: colors.bg,
      gap: 14,
    },

    menuItemIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },

    menuItemLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.heading,
    },

    menuCancelBtn: {
      paddingVertical: 14,
      borderRadius: radius.md,
      backgroundColor: colors.border + '60',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
    },

    menuCancelText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.heading,
    },
  });