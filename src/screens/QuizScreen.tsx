import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { useTheme } from '../context/ThemeContext';
import { useStorage } from '../context/StorageContext';
import { radius, spacing, scoreColor, scoreSoft } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

const LETTERS = ['A', 'B', 'C', 'D'];

const verdict = (pct: number) =>
  pct === 100
    ? { icon: 'trophy', text: 'Perfect Score!', sub: 'You completely mastered this set!' }
    : pct >= 80
    ? { icon: 'ribbon', text: 'Great Job!', sub: 'Excellent recall and understanding!' }
    : pct >= 50
    ? { icon: 'thumbs-up', text: 'Good Effort!', sub: 'Keep reviewing to lock in your memory.' }
    : { icon: 'barbell', text: 'Keep Practicing!', sub: 'Repetition is the key to mastery.' };

export const QuizScreen: React.FC<Props> = ({ route, navigation }) => {
  const { deckId, quizId } = route.params ?? {};
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { decks, quizzes, highScores, saveHighScore } = useStorage();

  const deck = deckId ? decks.find((d) => d.id === deckId) : undefined;
  const quiz = quizId ? quizzes.find((q) => q.id === quizId) : undefined;

  const isMultipleChoice = !!quiz;
  const title = deck ? deck.title : quiz ? quiz.title : 'Quiz';
  const total = isMultipleChoice
    ? quiz?.questions.length ?? 0
    : deck?.cards.length ?? 0;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnsweredMC, setHasAnsweredMC] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Restart quiz
  const restart = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsFlipped(false);
    setSelectedOption(null);
    setHasAnsweredMC(false);
    setQuizFinished(false);
  };

  // Flashcard response (Correct / Incorrect)
  const handleFlashcardAnswer = (correct: boolean) => {
    const updatedScore = correct ? score + 1 : score;
    setScore(updatedScore);
    setIsFlipped(false);

    if (currentIndex + 1 < total) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      if (deck) {
        saveHighScore({
          deckId: deck.id,
          deckTitle: deck.title,
          score: updatedScore,
          totalQuestions: total,
          date: new Date().toLocaleDateString(),
        });
      }
    }
  };

  // Multiple Choice response
  const handleOptionSelect = (index: number) => {
    if (hasAnsweredMC || !quiz) return;
    setSelectedOption(index);
    setHasAnsweredMC(true);

    const currentQ = quiz.questions[currentIndex];
    const isCorrect = index === currentQ.correctIndex;
    const updatedScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(updatedScore);

    setTimeout(() => {
      if (currentIndex + 1 < total) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setHasAnsweredMC(false);
      } else {
        setQuizFinished(true);
        saveHighScore({
          deckId: quiz.id,
          deckTitle: quiz.title,
          score: updatedScore,
          totalQuestions: total,
          date: new Date().toLocaleDateString(),
        });
      }
    }, 1200);
  };

  // Empty state
  if (total === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerContainer}>
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <Ionicons
                name="alert-circle-outline"
                size={42}
                color={colors.muted}
              />
            </View>
            <Text style={styles.emptyCardTitle}>No Questions Available</Text>
            <Text style={styles.emptyCardText}>
              This {isMultipleChoice ? 'quiz' : 'deck'} doesn&apos;t have any cards
              or questions yet.
            </Text>
            <PrimaryButton
              title="Go Back"
              onPress={() => navigation.goBack()}
              style={{ width: '100%', marginTop: 14 }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Finished view
  if (quizFinished) {
    const pct = Math.round((score / total) * 100);
    const v = verdict(pct);
    const relatedScores = highScores.filter(
      (s) => s.deckId === (deck?.id ?? quiz?.id),
    );
    const bestScore = relatedScores.length
      ? Math.max(...relatedScores.map((s) => s.score))
      : score;

    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.resultScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Trophy Header Card */}
          <View style={styles.resultCard}>
            <View
              style={[
                styles.trophyCircle,
                { backgroundColor: scoreSoft(pct) },
              ]}
            >
              <Ionicons
                name={v.icon as any}
                size={60}
                color={scoreColor(pct)}
              />
            </View>

            <Text style={styles.finishTitle}>{v.text}</Text>
            <Text style={styles.finishSub}>{v.sub}</Text>

            {/* Score Breakdown Card */}
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreTitle}>YOUR RESULT</Text>
              <Text style={styles.scoreBig}>
                {score}
                <Text style={styles.scoreTotal}> / {total}</Text>
              </Text>

              <View
                style={[
                  styles.percentagePill,
                  { backgroundColor: scoreSoft(pct) },
                ]}
              >
                <Text
                  style={[
                    styles.percentageText,
                    { color: scoreColor(pct) },
                  ]}
                >
                  {pct}% Accuracy
                </Text>
              </View>
            </View>

            {/* High Score Stat Badge */}
            <View style={styles.highScoreCard}>
              <Ionicons name="star" size={18} color="#F59E0B" />
              <Text style={styles.highScoreText}>
                Best Score: {bestScore} / {total}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.resultActions}>
            <PrimaryButton title="Retry Quiz" onPress={restart} />
            <PrimaryButton
              title="Back"
              onPress={() => navigation.goBack()}
              variant="secondary"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Progress Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.deckName} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>
                {currentIndex + 1} of {total}
              </Text>
            </View>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* ── FLASHCARD MODE ── */}
        {!isMultipleChoice && deck && (
          <View style={styles.flashcardArea}>
            <TouchableOpacity
              style={styles.cardContainer}
              activeOpacity={0.92}
              onPress={() => setIsFlipped((prev) => !prev)}
            >
              {/* Card Top Label & Flip Button */}
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.tagBadge,
                    {
                      backgroundColor: isFlipped
                        ? colors.success + '20'
                        : colors.primary + '18',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagBadgeText,
                      { color: isFlipped ? colors.success : colors.primary },
                    ]}
                  >
                    {isFlipped ? 'ANSWER' : 'QUESTION'}
                  </Text>
                </View>

                <View style={styles.flipActionRow}>
                  <Ionicons
                    name="sync-outline"
                    size={16}
                    color={colors.muted}
                  />
                  <Text style={styles.flipHintText}>Tap to flip</Text>
                </View>
              </View>

              {/* Card Content */}
              <View style={styles.cardBody}>
                <Text style={styles.questionText}>
                  {deck.cards[currentIndex].question}
                </Text>

                {isFlipped && (
                  <View style={styles.answerBox}>
                    <Text style={styles.answerLabel}>ANSWER</Text>
                    <Text style={styles.answerText}>
                      {deck.cards[currentIndex].answer}
                    </Text>
                  </View>
                )}
              </View>

              {/* Bottom Card Footer */}
              <View style={styles.cardFooter}>
                <Ionicons
                  name={isFlipped ? 'checkmark-circle' : 'help-circle-outline'}
                  size={20}
                  color={isFlipped ? colors.success : colors.muted}
                />
                <Text style={styles.cardFooterText}>
                  {isFlipped
                    ? 'Did you get this right?'
                    : 'Tap anywhere to reveal answer'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Response Buttons */}
            <View style={styles.actionContainer}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.answerButton, styles.incorrectButton]}
                  onPress={() => handleFlashcardAnswer(false)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close-circle" size={20} color="#EF4444" />
                  <Text style={styles.incorrectText}>Incorrect</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.answerButton, styles.correctButton]}
                  onPress={() => handleFlashcardAnswer(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.correctText}>Correct</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ── MULTIPLE CHOICE MODE ── */}
        {isMultipleChoice && quiz && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.mcScroll}
          >
            {/* Question Card */}
            <View style={styles.mcQuestionCard}>
              <View style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>QUESTION</Text>
              </View>
              <Text style={styles.mcQuestionText}>
                {quiz.questions[currentIndex].question}
              </Text>
            </View>

            {/* Options Cards */}
            <View style={styles.optionsList}>
              {quiz.questions[currentIndex].options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect =
                  i === quiz.questions[currentIndex].correctIndex;

                let cardStyle: StyleProp<ViewStyle> = styles.optionCard;
                let textStyle: StyleProp<TextStyle> = styles.optionText;
                let badgeBg = colors.inputBg;
                let badgeTextColor = colors.heading;

                if (hasAnsweredMC) {
                  if (isCorrect) {
                    cardStyle = [styles.optionCard, styles.optionCardCorrect];
                    textStyle = [styles.optionText, styles.optionTextCorrect];
                    badgeBg = colors.success;
                    badgeTextColor = '#FFFFFF';
                  } else if (isSelected && !isCorrect) {
                    cardStyle = [styles.optionCard, styles.optionCardIncorrect];
                    textStyle = [styles.optionText, styles.optionTextIncorrect];
                    badgeBg = colors.danger;
                    badgeTextColor = '#FFFFFF';
                  }
                } else if (isSelected) {
                  cardStyle = [styles.optionCard, styles.optionCardSelected];
                  badgeBg = colors.primary;
                  badgeTextColor = '#FFFFFF';
                }

                return (
                  <TouchableOpacity
                    key={i}
                    style={cardStyle}
                    onPress={() => handleOptionSelect(i)}
                    activeOpacity={0.7}
                    disabled={hasAnsweredMC}
                  >
                    <View
                      style={[styles.letterBadge, { backgroundColor: badgeBg }]}
                    >
                      <Text
                        style={[
                          styles.letterBadgeText,
                          { color: badgeTextColor },
                        ]}
                      >
                        {LETTERS[i]}
                      </Text>
                    </View>
                    <Text style={textStyle}>{opt}</Text>
                    {hasAnsweredMC && isCorrect && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={colors.success}
                        style={{ marginLeft: 'auto' }}
                      />
                    )}
                    {hasAnsweredMC && isSelected && !isCorrect && (
                      <Ionicons
                        name="close-circle"
                        size={22}
                        color={colors.danger}
                        style={{ marginLeft: 'auto' }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default QuizScreen;

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    container: {
      flex: 1,
      padding: spacing.md,
      backgroundColor: colors.bg,
    },

    // ── PROGRESS HEADER CARD ────────────────────────────────────────────────
    headerCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
      ...Platform.select({
        ios: {
          shadowColor: '#2E1065',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        android: { elevation: 2 },
      }),
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    deckName: {
      flex: 1,
      fontSize: 16,
      fontWeight: '800',
      color: colors.heading,
      marginRight: spacing.sm,
    },
    counterBadge: {
      backgroundColor: colors.primarySoft,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: radius.pill,
    },
    counterText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '700',
    },
    track: {
      height: 8,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
    },

    // ── FLASHCARD CARD DESIGN ───────────────────────────────────────────────
    flashcardArea: {
      flex: 1,
      justifyContent: 'space-between',
    },
    cardContainer: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 28,
      borderWidth: 1.5,
      borderColor: colors.border,
      padding: 22,
      justifyContent: 'space-between',
      marginBottom: 16,
      ...Platform.select({
        ios: {
          shadowColor: '#2E1065',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        },
        android: { elevation: 4 },
      }),
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    tagBadge: {
      backgroundColor: colors.primarySoft,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: radius.pill,
    },
    tagBadgeText: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.5,
    },
    flipActionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    flipHintText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.muted,
    },
    cardBody: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: 20,
    },
    questionText: {
      fontSize: 21,
      fontWeight: '700',
      color: colors.heading,
      textAlign: 'center',
      lineHeight: 30,
    },
    answerBox: {
      marginTop: 22,
      backgroundColor: colors.primarySoft,
      borderRadius: 18,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    answerLabel: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 1,
      marginBottom: 4,
    },
    answerText: {
      fontSize: 17,
      color: colors.heading,
      fontWeight: '600',
      lineHeight: 24,
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    cardFooterText: {
      fontSize: 12,
      color: colors.muted,
      fontWeight: '500',
    },

    // ── FLASHCARD BUTTONS ───────────────────────────────────────────────────
    actionContainer: {
      paddingBottom: 8,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
    },
    answerButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 14,
      borderRadius: radius.pill,
    },
    incorrectButton: {
      backgroundColor: '#FEF2F2',
      borderWidth: 1,
      borderColor: '#FECACA',
    },
    incorrectText: {
      color: '#DC2626',
      fontSize: 15,
      fontWeight: '700',
    },
    correctButton: {
      backgroundColor: colors.success,
    },
    correctText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },

    // ── MULTIPLE CHOICE ─────────────────────────────────────────────────────
    mcScroll: {
      paddingBottom: 20,
    },
    mcQuestionCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 20,
      marginBottom: 18,
      ...Platform.select({
        ios: {
          shadowColor: '#2E1065',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
        },
        android: { elevation: 2 },
      }),
    },
    mcQuestionText: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.heading,
      marginTop: 12,
      lineHeight: 26,
    },
    optionsList: {
      gap: 10,
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 14,
      paddingHorizontal: 16,
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
    optionCardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primarySoft + '40',
    },
    optionCardCorrect: {
      borderColor: colors.success,
      backgroundColor: '#E7F8EF',
    },
    optionCardIncorrect: {
      borderColor: colors.danger,
      backgroundColor: '#FEF2F2',
    },
    letterBadge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    letterBadgeText: {
      fontSize: 14,
      fontWeight: '800',
    },
    optionText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: colors.heading,
    },
    optionTextCorrect: {
      color: '#15803D',
      fontWeight: '700',
    },
    optionTextIncorrect: {
      color: '#B91C1C',
      fontWeight: '700',
    },

    // ── EMPTY STATE CARD ────────────────────────────────────────────────────
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyCard: {
      backgroundColor: colors.card,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 28,
      alignItems: 'center',
      width: '100%',
      maxWidth: 340,
    },
    emptyIconWrap: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    emptyCardTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.heading,
      marginBottom: 6,
    },
    emptyCardText: {
      fontSize: 13,
      color: colors.muted,
      textAlign: 'center',
      lineHeight: 19,
    },

    // ── RESULT FINISHED CARD ────────────────────────────────────────────────
    resultScroll: {
      padding: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    resultCard: {
      width: '100%',
      backgroundColor: colors.card,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 24,
      alignItems: 'center',
      marginBottom: 20,
      ...Platform.select({
        ios: {
          shadowColor: '#2E1065',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        },
        android: { elevation: 4 },
      }),
    },
    trophyCircle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    finishTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.heading,
      marginBottom: 4,
    },
    finishSub: {
      fontSize: 13,
      color: colors.muted,
      textAlign: 'center',
      marginBottom: 20,
    },
    scoreContainer: {
      width: '100%',
      backgroundColor: colors.inputBg,
      borderRadius: 20,
      paddingVertical: 18,
      alignItems: 'center',
      marginBottom: 14,
    },
    scoreTitle: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.muted,
      letterSpacing: 1,
      marginBottom: 4,
    },
    scoreBig: {
      fontSize: 38,
      fontWeight: '800',
      color: colors.heading,
    },
    scoreTotal: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.muted,
    },
    percentagePill: {
      marginTop: 8,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: radius.pill,
    },
    percentageText: {
      fontSize: 13,
      fontWeight: '800',
    },
    highScoreCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: '#FEF3C7',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: radius.pill,
    },
    highScoreText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#B45309',
    },
    resultActions: {
      width: '100%',
      gap: 10,
    },
  });