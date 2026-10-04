import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizEditor'>;

const LETTERS = ['A', 'B', 'C', 'D'];

export const QuizEditorScreen: React.FC<Props> = ({ route, navigation }) => {

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);


  const [options, setOptions] = useState(['', '', '', '']);
  const [correct, setCorrect] = useState<number | null>(null);



  const setOption = (i: number, text: string) =>
    setOptions((prev) => prev.map((o, idx) => (idx === i ? text : o)));

<<<<<<< HEAD
=======
  const add = () => {
    const trimmed = options.map((o) => o.trim());
    const filled = trimmed.map((text, i) => ({ text, i })).filter((o) => o.text);

    if (!question.trim()) return Alert.alert('Missing question', 'Type the question first.');
    if (filled.length < 2) return Alert.alert('Need more options', 'Fill in at least 2 answer options.');
    if (correct === null || !trimmed[correct]) {
      return Alert.alert('Pick the correct answer', 'Tap the circle next to the right option.');
    }

    const finalOptions = filled.map((f) => f.text);
    const finalCorrect = filled.findIndex((f) => f.i === correct);

    addQuestion(quizId, question.trim(), finalOptions, finalCorrect);
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrect(null);
  };

  const count = quiz.questions.length;

  const handleStartQuiz = () => {
    if (count === 0) {
      Alert.alert('No questions yet', 'Add at least one question to start the quiz.');
      return;
    }
    navigation.navigate('Quiz', { quizId });
  };

<<<<<<< HEAD
=======
>>>>>>> 7244ae1 (all files that have changes)
>>>>>>> temp-work
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
    
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>


            <View style={styles.form}>
              <Text style={styles.label}>Question</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. What is the powerhouse of the cell?"
                placeholderTextColor={colors.muted}
                multiline
              />

              <Text style={styles.label}>Answer options (tap the circle for the correct one)</Text>
              {LETTERS.map((letter, i) => {
                const selected = correct === i;
                return (
                  <View key={letter} style={styles.optionRow}>
                    <TouchableOpacity
                      onPress={() => setCorrect(i)}
                      hitSlop={8}
                      style={[
                        styles.radio,
                        selected && { backgroundColor: colors.success, borderColor: colors.success },
                      ]}
                    >
                      {selected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                    </TouchableOpacity>
                    <Text style={styles.letter}>{letter}</Text>
                    <TextInput
                      style={[styles.optionInput, selected && { borderColor: colors.success }]}
                      value={options[i]}
                      onChangeText={(t) => setOption(i, t)}
                      placeholder={i < 2 ? `Option ${letter}` : `Option ${letter} (optional)`}
                      placeholderTextColor={colors.muted}
                    />
                  </View>
                );
              })}

              <PrimaryButton title="Add Question" onPress={() => Alert.alert('Not Available', 'This feature is coming soon!')} />

            </View>

            <Text style={styles.section}>

            </Text>
          </View>
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No questions yet. Add your first one above.</Text>}
      />

      <View style={styles.footer}>
        <PrimaryButton
<<<<<<< HEAD
          title={count === 0 ? 'Add a question to start' : 'Start Quiz'}
          onPress={handleStartQuiz}
=======
<<<<<<< HEAD
          title={0 === 0 ? 'Add a question to start' : 'Start Quiz'}
          onPress={() =>
            Alert.alert('Not Available', 'This feature is coming soon!')
          }
=======
          title={count === 0 ? 'Add a question to start' : 'Start Quiz'}
          onPress={handleStartQuiz}
>>>>>>> 7244ae1 (all files that have changes)
>>>>>>> temp-work
        />
      </View>
    </KeyboardAvoidingView>
  );
};




















export default QuizEditorScreen;

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg, padding: 20 },
    list: { padding: spacing.md, paddingBottom: spacing.xl },
    quizTitle: { fontSize: 26, fontWeight: '800', color: colors.heading },
    quizDesc: { fontSize: 14, color: colors.muted, marginTop: 4 },
    form: {
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginTop: spacing.md,
      marginBottom: spacing.lg,
    },
    label: { fontSize: 13, fontWeight: '700', color: colors.muted, marginBottom: 8 },
    input: {
      backgroundColor: colors.inputBg,
      color: colors.heading,
      borderRadius: radius.md,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      minHeight: 48,
      marginBottom: spacing.md,
    },
    optionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    radio: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    letter: { width: 16, fontSize: 14, fontWeight: '800', color: colors.muted },
    optionInput: {
      flex: 1,
      backgroundColor: colors.inputBg,
      color: colors.heading,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderColor: 'transparent',
      paddingHorizontal: 14,
      paddingVertical: 11,
      fontSize: 15,
    },
    section: { fontSize: 18, fontWeight: '800', color: colors.heading, marginBottom: spacing.sm },
    count: { color: colors.muted, fontWeight: '700' },
    qRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    qNum: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qNumText: { fontSize: 13, fontWeight: '800', color: colors.primary },
    qText: { fontSize: 15, fontWeight: '700', color: colors.heading, marginBottom: 6 },
    previewRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
    previewText: { fontSize: 13, color: colors.muted, flex: 1 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.heading, marginBottom: 12 },
    emptyText: { color: colors.muted, textAlign: 'center', marginTop: spacing.md },
    footer: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg },
  });