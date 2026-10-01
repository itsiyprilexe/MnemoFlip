import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
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

  const styles = useMemo(
    () => createStyles(colors),
    [colors]
  );

  const quizzes: any[] = [];
  const createQuiz = (title: string, desc: string) => '123';
  const deleteQuiz = (id: string) => {};

  const [modalVisible, setModalVisible] =
    useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] =
    useState('');

  const closeModal = useCallback(() => {
    setTitle('');
    setDescription('');
    setModalVisible(false);
  }, []);

  const handleCreate = () => {
    if (!title.trim()) {
      return Alert.alert(
        'Validation Error',
        'Quiz title is required'
      );
    }

    const id = createQuiz(
      title.trim(),
      description.trim()
    );

    closeModal();

    navigation.navigate('QuizEditor', {
      quizId: id,
    });
  };

  const open = (
    quizId: string,
    count: number
  ) => {
    if (count === 0) {
      return navigation.navigate(
        'QuizEditor',
        { quizId }
      );
    }

    navigation.navigate('Quiz', {
      quizId,
    });
  };

  const confirmDelete = (
    quizId: string,
    name: string
  ) =>
    Alert.alert(
      'Delete quiz',
      `Delete "${name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            deleteQuiz(quizId),
        },
      ]
    );

  const countLabel = `${quizzes.length} ${
    quizzes.length === 1
      ? 'quiz'
      : 'quizzes'
  }`;

  return (
    <View style={styles.container}>
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom:
              insets.bottom + 110,
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.section}>
                Your quizzes
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
                New quiz
              </Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item, index }) => {
          const count =
            item.questions.length;

          const isEmpty = count === 0;

          return (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={() =>
                open(item.id, count)
              }
              onLongPress={() =>
                confirmDelete(
                  item.id,
                  item.title
                )
              }
            >
              <View style={styles.tile}>
                <Ionicons
                  name={
                    ICONS[
                      index %
                        ICONS.length
                    ]
                  }
                  size={22}
                  color={BLUE}
                />
              </View>

              <View style={styles.body}>
                <Text
                  style={styles.title}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                <Text style={styles.meta}>
                  {isEmpty
                    ? 'No questions yet'
                    : `${count} ${
                        count === 1
                          ? 'question'
                          : 'questions'
                      }`}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() =>
                  navigation.navigate(
                    'QuizEditor',
                    {
                      quizId: item.id,
                    }
                  )
                }
                hitSlop={6}
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={BLUE}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() =>
                  confirmDelete(
                    item.id,
                    item.title
                  )
                }
                hitSlop={6}
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

              <View
                style={[
                  styles.playBtn,
                  isEmpty
                    ? styles.playBtnEmpty
                    : styles.playBtnActive,
                ]}
              >
                <Ionicons
                  name={
                    isEmpty
                      ? 'add'
                      : 'play'
                  }
                  size={
                    isEmpty ? 20 : 16
                  }
                  color={
                    isEmpty
                      ? BLUE
                      : '#FFFFFF'
                  }
                  style={
                    isEmpty
                      ? undefined
                      : { marginLeft: 2 }
                  }
                />
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="document-text-outline"
              size={48}
              color={BLUE}
              style={{
                marginBottom:
                  spacing.sm,
              }}
            />

            <Text
              style={styles.emptyTitle}
            >
              No quizzes yet
            </Text>

            <Text
              style={styles.emptyText}
            >
              Tap &quot;New quiz&quot; to make
              your first one.
            </Text>
          </View>
        }
      />

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
          <Pressable
            style={
              StyleSheet.absoluteFill
            }
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
            <View
              style={styles.handle}
            />

            <Text
              style={styles.modalTitle}
            >
              New quiz
            </Text>

            <StyledTextInput
              label="Quiz Title"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Biology Basics"
            />

            <StyledTextInput
              label="Description (Optional)"
              value={description}
              onChangeText={
                setDescription
              }
              placeholder="Short description..."
            />

            <View
              style={styles.modalButtons}
            >
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
                title="Create quiz"
                onPress={handleCreate}
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

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth:
        StyleSheet.hairlineWidth,
      borderColor: colors.border,
      padding: spacing.sm + 4,
      marginBottom:
        spacing.sm + 2,
      gap: spacing.sm,
    },

    tile: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        '#EAF4FF',
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
      backgroundColor:
        '#EAF4FF',
    },

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

    modalOverlay: {
      flex: 1,
      backgroundColor:
        'rgba(0,0,0,0.5)',
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