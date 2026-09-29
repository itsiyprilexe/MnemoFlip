import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { StyledTextInput } from '../components/StyledTextInput';
import { useDecks } from '../context/DeckContext';
import { colors, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AddCard'>;

export const AddCardScreen: React.FC<Props> = ({ route, navigation }) => {
  const { deckId } = route.params;
  const { decks, addCard } = useDecks();
  const deck = decks.find((d) => d.id === deckId);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!question.trim() || !answer.trim()) {
      return Alert.alert('Validation Error', 'Both a question and an answer are required.');
    }
    addCard(deckId, question, answer);
    setSaved(true);
  };

  const addAnother = () => {
    setQuestion('');
    setAnswer('');
    setSaved(false);
  };

  // Back to the deck screen (skips Add Cards + this screen).
  const done = () => navigation.pop(2);

  if (saved) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successBody}>
          <View style={styles.check}>
            <Ionicons name="checkmark" size={56} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Card Added!</Text>
          <Text style={styles.successText}>Your card has been added to {deck?.title ?? 'your deck'}.</Text>
        </View>
        <View style={styles.footer}>
          <PrimaryButton title="Add Another Card" onPress={addAnother} />
          <PrimaryButton title="Done" variant="secondary" onPress={done} style={{ marginTop: 12 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.heading} />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>New Card</Text>
          <Text style={styles.subtitle}>Adding to {deck?.title ?? 'your deck'}</Text>
          <StyledTextInput
            label="Question"
            value={question}
            onChangeText={setQuestion}
            placeholder="e.g. What is a hook?"
          />
          <StyledTextInput
            label="Answer"
            value={answer}
            onChangeText={setAnswer}
            placeholder="e.g. A function that lets you use state"
          />
          <PrimaryButton title="Save Card" onPress={save} style={{ marginTop: spacing.md }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddCardScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  back: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, alignSelf: 'flex-start' },
  form: { padding: spacing.md },
  title: { fontSize: 32, fontWeight: '800', color: colors.heading, marginTop: spacing.md },
  subtitle: { fontSize: 16, color: colors.muted, marginTop: 6, marginBottom: spacing.lg },
  successBody: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  check: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: { fontSize: 30, fontWeight: '800', color: colors.heading },
  successText: { fontSize: 17, color: colors.muted, marginTop: 8, textAlign: 'center' },
  footer: { padding: spacing.md, paddingBottom: spacing.lg },
});