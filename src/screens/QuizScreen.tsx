import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, radius, spacing, scoreColor, scoreSoft } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

const verdict = (pct: number) =>
  pct === 100 ? { icon: 'trophy', text: 'Perfect!' }
  : pct >= 80 ? { icon: 'trophy', text: 'Great Job!' }
  : pct >= 50 ? { icon: 'thumbs-up', text: 'Good effort!' }
  : { icon: 'barbell', text: 'Keep practicing!' };

export const QuizScreen: React.FC<Props> = ({ route, navigation }) => {
  const { deckId } = route.params;
  const decks: any[] = [];
  const highScores: any[] = [];
  const saveHighScore = (id: string, title: string, score: number, total: number) => {};

  const deck = decks.find((d) => d.id === deckId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [round, setRound] = useState(0); // changes the CardFlip key so each card resets to its front

  const handleAnswer = (correct: boolean) => {
    const updatedScore = correct ? score + 1 : score;
    setScore(updatedScore);

    if (deck && currentIndex + 1 < deck.cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      if (deck) saveHighScore(deck.id, deck.title, updatedScore, deck.cards.length);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setScore(0);
    setQuizFinished(false);
    setRound((r) => r + 1);
  };

  if (!deck || deck.cards.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="albums-outline" size={56} color={colors.muted} style={{ marginBottom: spacing.sm }} />
        <Text style={styles.infoText}>This deck has no cards yet!</Text>
        <PrimaryButton title="Back to Decks" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const total = deck.cards.length;

  if (quizFinished) {
    const pct = Math.round((score / total) * 100);
    const v = verdict(pct);
    const best = Math.max(
      score,
      ...highScores.filter((s) => s.deckId === deck.id).map((s) => s.score),
    );
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.result}>
          <Ionicons name={v.icon as any} size={84} color="#F5B301" style={{ marginBottom: spacing.sm }} />
          <Text style={styles.finishTitle}>{v.text}</Text>

          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Your Score</Text>
            <Text style={styles.scoreBig}>
              {score} / {total}
            </Text>
            <View style={[styles.pill, { backgroundColor: scoreSoft(pct) }]}>
              <Text style={[styles.pillText, { color: scoreColor(pct) }]}>
                {pct}% · High Score: {best}
              </Text>
            </View>
          </View>

          <View style={styles.resultActions}>
            <PrimaryButton title="Retry Quiz" onPress={restart} />
            <PrimaryButton title="Back to Deck" onPress={() => navigation.goBack()} variant="secondary" />
            <PrimaryButton
              title="View High Scores"
              onPress={() => navigation.navigate('Main', { screen: 'ProfileTab' })}
              variant="secondary"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard = deck.cards[currentIndex];
  const progress = (currentIndex / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressHeader}>
        <Text style={styles.deckName} numberOfLines={1}>
          {deck.title}
        </Text>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {total}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.cardWrap}>
        <View style={{ padding: 20, backgroundColor: colors.card, borderRadius: radius.md }}>
          <Text style={{ fontSize: 18, color: colors.heading }}>
            {currentCard.question}
          </Text>
          <Text style={{ fontSize: 16, color: colors.muted, marginTop: 10 }}>
            {currentCard.answer}
          </Text>
        </View>
        <View style={styles.hintPill}>
          <Text style={styles.hint}>Tap to flip</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <Text style={styles.questionPrompt}>Did you get it right?</Text>
        <View style={styles.buttonRow}>
          <PrimaryButton
            title="Incorrect"
            onPress={() => handleAnswer(false)}
            variant="danger"
            style={{ flex: 1, marginRight: 8 }}
          />
          <PrimaryButton
            title="Correct"
            onPress={() => handleAnswer(true)}
            style={{ flex: 1, backgroundColor: colors.success }}
          />
        </View>
      </View>
    </View>
  );
};

export default QuizScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.bg },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: colors.bg },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  deckName: { flex: 1, fontSize: 16, fontWeight: '800', color: colors.heading, marginRight: spacing.sm },
  progressText: { fontSize: 15, color: colors.muted, fontWeight: '700' },
  track: { height: 8, borderRadius: radius.pill, backgroundColor: colors.primarySoft, overflow: 'hidden', marginBottom: spacing.lg },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.pill },
  cardWrap: { flex: 1, justifyContent: 'center' },
  hintPill: {
    alignSelf: 'center',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  hint: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  questionPrompt: { fontSize: 16, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 10 },
  actionContainer: { paddingTop: spacing.md },
  buttonRow: { flexDirection: 'row' },
  infoText: { fontSize: 18, color: colors.muted, marginBottom: 20 },
  result: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  finishTitle: { fontSize: 30, fontWeight: '800', color: colors.heading, marginBottom: spacing.lg },
  scoreBox: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  scoreLabel: { fontSize: 15, color: colors.text, fontWeight: '600' },
  scoreBig: { fontSize: 40, fontWeight: '800', color: colors.heading, marginVertical: 6 },
  pill: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: radius.md },
  pillText: { fontSize: 14, fontWeight: '700' },
  resultActions: { width: '100%', gap: 10 },
});