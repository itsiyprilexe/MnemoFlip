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
import { radius, spacing, accents } from '../theme';

const ICONS = ['school', 'flask', 'calculator', 'book', 'leaf', 'color-palette'] as const;

// Prototype data: hardcoded quizzes so the UI always looks populated.
type SampleQuiz = {
  id: string;
  title: string;
  description: string;
  questions: { id: string }[];
};

const makeQuestions = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ id: `q${i + 1}` }));

const SAMPLE_QUIZZES: SampleQuiz[] = [
  { id: '1', title: 'Biology Basics', description: 'Cells, genetics and ecosystems', questions: makeQuestions(12) },
  { id: '2', title: 'Chemistry: Periodic Table', description: 'Elements and groups', questions: makeQuestions(8) },
  { id: '3', title: 'Algebra Review', description: 'Equations and functions', questions: makeQuestions(15) },
  { id: '4', title: 'World History', description: 'Major events and dates', questions: makeQuestions(1) },
  { id: '5', title: 'Environmental Science', description: '', questions: [] }, // shows the "No questions yet" state
];

export const QuizPickerScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [quizzes, setQuizzes] = useState<SampleQuiz[]>(SAMPLE_QUIZZES);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createQuiz = (quizTitle: string, quizDescription: string) => {
    const id = `quiz-${Date.now()}`;
    setQuizzes((prev) => [...prev, { id, title: quizTitle, description: quizDescription, questions: [] }]);
    return id;
  };

  const deleteQuiz = (quizId: string) =>
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));

  const closeModal = useCallback(() => {
    setTitle('');
    setDescription('');
    setModalVisible(false);
  }, []);

  const handleCreate = () => {
    if (!title.trim()) {
      return Alert.alert('Validation Error', 'Quiz title is required');
    }
    const id = createQuiz(title.trim(), description.trim());
    closeModal();
    navigation.navigate('QuizEditor', { quizId: id });
  };

  const open = (quizId: string, count: number) => {
    if (count === 0) return navigation.navigate('QuizEditor', { quizId });
    navigation.navigate('Quiz', { quizId });
  };

  const confirmDelete = (quizId: string, name: string) =>
    Alert.alert('Delete quiz', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteQuiz(quizId) },
    ]);

  const countLabel = `${quizzes.length} ${quizzes.length === 1 ? 'quiz' : 'quizzes'}`;

  return (
    <View style={styles.container}>
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.section}>Your quizzes</Text>
              <Text style={styles.subtitle}>{countLabel}</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addBtnText}>New quiz</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item, index }) => {
          const accent = accents[index % accents.length];
          const count = item.questions.length;
          const isEmpty = count === 0;
          return (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={() => open(item.id, count)}
              onLongPress={() => confirmDelete(item.id, item.title)}
            >
              <View style={[styles.tile, { backgroundColor: accent + '26' }]}>
                <Ionicons name={ICONS[index % ICONS.length]} size={22} color={accent} />
              </View>

              <View style={styles.body}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.meta}>
                  {isEmpty ? 'No questions yet' : `${count} ${count === 1 ? 'question' : 'questions'}`}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => navigation.navigate('QuizEditor', { quizId: item.id })}
                hitSlop={6}
                accessibilityLabel={`Edit ${item.title}`}
              >
                <Ionicons name="create-outline" size={18} color={colors.muted} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => confirmDelete(item.id, item.title)}
                hitSlop={6}
                accessibilityLabel={`Delete ${item.title}`}
              >
                <Ionicons name="trash-outline" size={18} color={colors.danger ?? '#EF4444'} />
              </TouchableOpacity>

              <View style={[styles.playBtn, isEmpty ? styles.playBtnEmpty : { backgroundColor: colors.primary }]}>
                <Ionicons
                  name={isEmpty ? 'add' : 'play'}
                  size={isEmpty ? 20 : 16}
                  color={isEmpty ? colors.muted : '#FFFFFF'}
                  style={isEmpty ? undefined : { marginLeft: 2 }}
                />
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={48} color={colors.muted} style={{ marginBottom: spacing.sm }} />
            <Text style={styles.emptyTitle}>No quizzes yet</Text>
            <Text style={styles.emptyText}>Tap "New quiz" to make your first one.</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 12 }]}>
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
                onPress={closeModal}
                variant="secondary"
                style={{ flex: 1, marginRight: 8 }}
              />
              <PrimaryButton title="Create quiz" onPress={handleCreate} style={{ flex: 1 }} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default QuizPickerScreen;

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    list: { padding: spacing.md },

    // Header
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
      paddingHorizontal: 4,
    },
    section: { fontSize: 24, fontWeight: '800', color: colors.heading, letterSpacing: -0.3 },
    subtitle: { fontSize: 13, color: colors.muted, marginTop: 2, fontWeight: '600' },
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
    addBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

    // Rows
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
    tile: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    body: { flex: 1, marginLeft: 2 },
    title: { fontSize: 16, fontWeight: '700', color: colors.heading },
    meta: { fontSize: 13, color: colors.muted, marginTop: 2 },
    iconBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    playBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 2,
    },
    playBtnEmpty: { borderWidth: 1, borderColor: colors.border },

    // Empty
    empty: { alignItems: 'center', marginTop: 40 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.heading },
    emptyText: { color: colors.muted, marginTop: 4, textAlign: 'center' },

    // Bottom sheet
    modalOverlay: { flex: 1, backgroundColor: 'rgba(30,27,75,0.5)', justifyContent: 'flex-end' },
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
    modalTitle: { fontSize: 20, fontWeight: '800', color: colors.heading, marginBottom: 12 },
    modalButtons: { flexDirection: 'row', marginTop: 12 },
  });