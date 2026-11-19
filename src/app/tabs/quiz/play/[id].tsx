import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { AppButton } from '../../../../components/AppButton';
import { FormScreenHeader } from '../../../../components/FormScreenHeader';
import { useAuth } from '../../../../contexts/AuthContext';
import { getQuizQuestions } from '../../../../services/contentService';
import { getItem } from '../../../../services/itemService';
import type { StudyContent } from '../../../../types/models';
import { palette } from '../../../../theme';

const normalize = (answer: string) => answer.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
export default function PlayQuiz() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const uid = user?.uid;
  const [questions, setQuestions] = useState<StudyContent[]>([]);
  const [title, setTitle] = useState('Quiz');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    let active = true;
    setQuestions([]); setAnswers({}); setIndex(0); setFinished(false); setError(''); setLoading(true);
    if (!uid || !id) { setLoading(false); return; }
    Promise.all([getItem(uid, 'quiz', id), getQuizQuestions(uid, id)]).then(([quiz, list]) => {
      if (!active) return;
      if (!quiz) { setError('Quiz not found.'); return; }
      if (list.some(q => !q.question.trim() || !q.answer.trim() || (q.type === 'multipleChoice' && (q.choices.length < 2 || !q.choices.includes(q.answer))))) { setError('Some questions are incomplete. Edit the quiz before starting.'); return; }
      setTitle(quiz.title); setQuestions(list);
    }).catch(e => { if (active) setError(e instanceof Error ? e.message : 'Could not load quiz.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [uid, id]);
  const question = questions[index];
  const currentAnswer = question ? answers[question.id] ?? '' : '';
  const score = questions.reduce((total, item) => total + (normalize(answers[item.id] ?? '') === normalize(item.answer) ? 1 : 0), 0);
  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
    <FormScreenHeader fallbackHref="/quiz" />
    <Text style={styles.eyebrow}>A LITTLE KNOWLEDGE CHECK</Text>
    <Text style={styles.title}>{title}</Text>
    {loading ? <ActivityIndicator style={styles.loading} color={palette.green} /> : error ? <Text style={styles.message}>{error}</Text> : questions.length === 0 ? <><Text style={styles.message}>This quiz has no questions yet. Add questions before starting.</Text><AppButton title="Edit quiz" onPress={() => router.replace({ pathname: '/(tabs)/quiz/[id]', params: { id } })} /></> : finished ? <>
      <View style={styles.resultCard}><View style={styles.resultIcon}><Ionicons name="checkmark-done-outline" size={29} color={palette.green} /></View><Text style={styles.resultTitle}>Quiz complete!</Text><Text style={styles.resultSubtitle}>A little progress adds up.</Text><Text style={styles.score}>{score} <Text style={styles.scoreTotal}>/ {questions.length}</Text></Text><Text style={styles.resultPercent}>{Math.round(score / questions.length * 100)}% correct</Text></View>
      <AppButton title="Try again" onPress={() => { setAnswers({}); setIndex(0); setFinished(false); }} style={{ marginBottom: 12 }} />
      <Pressable accessibilityRole="button" onPress={() => router.replace('/quiz')} style={styles.secondaryButton}><Text style={styles.backText}>Back to quizzes</Text></Pressable>
    </> : <>
      <View style={styles.progressHeader}><Text style={styles.progressLabel}>YOUR PROGRESS</Text><Text style={styles.progressCount}>{String(index + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}</Text></View>
      <View accessibilityRole="progressbar" accessibilityLabel="Quiz progress" accessibilityValue={{ min: 0, max: questions.length, now: index + 1 }} style={styles.progressTrack}><View style={[styles.progressFill, { width: `${((index + 1) / questions.length) * 100}%` }]} /></View>
      <View style={styles.questionCard}><View style={styles.questionTop}><View style={styles.questionIcon}><Ionicons name="help-outline" size={19} color={palette.green} /></View><Text style={styles.questionLabel}>QUESTION {String(index + 1).padStart(2, '0')}</Text></View><Text style={styles.heading}>{question.question}</Text><Text style={styles.questionHint}>{question.type === 'multipleChoice' ? 'Choose one answer below.' : 'Type your answer below.'}</Text></View>
      <Text style={styles.answerLabel}>{question.type === 'multipleChoice' ? 'SELECT AN ANSWER' : 'YOUR ANSWER'}</Text>
      {question.type === 'multipleChoice' ? question.choices.map((choice, i) => { const selected = currentAnswer === choice; return <Pressable key={i} accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={() => setAnswers(previous => ({ ...previous, [question.id]: choice }))} style={[styles.choice, selected && styles.selected]}><View style={[styles.choiceLetter, selected && styles.choiceLetterSelected]}><Text style={[styles.choiceLetterText, selected && styles.choiceLetterTextSelected]}>{String.fromCharCode(65 + i)}</Text></View><Text style={styles.choiceText}>{choice}</Text><Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} size={21} color={selected ? palette.green : '#D3DBD2'} /></Pressable>; }) : <TextInput accessibilityLabel="Your answer" value={currentAnswer} onChangeText={value => setAnswers(previous => ({ ...previous, [question.id]: value }))} placeholder="Type your answer" placeholderTextColor={palette.muted} style={styles.input} />}
      <View style={styles.buttons}>{index > 0 && <Pressable accessibilityRole="button" onPress={() => setIndex(index - 1)} style={styles.back}><Ionicons name="arrow-back" size={17} color={palette.green} /><Text style={styles.backText}>Previous</Text></Pressable>}
      <Pressable accessibilityRole="button" accessibilityState={{ disabled: !currentAnswer.trim() }} disabled={!currentAnswer.trim()} onPress={() => index === questions.length - 1 ? setFinished(true) : setIndex(index + 1)} style={[styles.next, !currentAnswer.trim() && styles.disabled]}><Text style={styles.nextText}>{index === questions.length - 1 ? 'Finish quiz' : 'Next question'}</Text><Ionicons name="arrow-forward" size={18} color="#fff" /></Pressable></View>
    </>}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background }, page: { padding: 22, paddingBottom: 120 }, loading: { marginTop: 30 },
  eyebrow: { color: palette.muted, fontSize: 9, letterSpacing: 1.3, fontWeight: '700', marginBottom: 8 }, title: { fontSize: 27, fontWeight: '700', color: '#294638' }, message: { color: palette.muted, marginVertical: 18, lineHeight: 20 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 27, marginBottom: 9 }, progressLabel: { color: palette.muted, fontSize: 9, letterSpacing: 1, fontWeight: '700' }, progressCount: { color: palette.green, fontSize: 11, fontWeight: '700' }, progressTrack: { height: 6, backgroundColor: '#E4EAE1', borderRadius: 6, overflow: 'hidden' }, progressFill: { height: '100%', backgroundColor: '#315D48', borderRadius: 6 },
  questionCard: { backgroundColor: palette.surface, borderColor: palette.line, borderWidth: 1, borderRadius: 20, padding: 18, marginTop: 24 }, questionTop: { flexDirection: 'row', alignItems: 'center', gap: 9 }, questionIcon: { width: 32, height: 32, borderRadius: 11, backgroundColor: palette.greenLight, justifyContent: 'center', alignItems: 'center' }, questionLabel: { color: palette.green, fontSize: 10, letterSpacing: 1, fontWeight: '700' }, heading: { fontSize: 20, lineHeight: 28, fontWeight: '700', color: '#294638', marginTop: 15 }, questionHint: { fontSize: 11, color: palette.muted, marginTop: 9 }, answerLabel: { color: palette.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1, marginTop: 25, marginBottom: 11 },
  choice: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, minHeight: 60, borderRadius: 15, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.surface, marginBottom: 9 }, selected: { borderColor: palette.green, backgroundColor: '#EDF3E9' }, choiceLetter: { width: 32, height: 32, borderRadius: 10, backgroundColor: palette.background, alignItems: 'center', justifyContent: 'center' }, choiceLetterSelected: { backgroundColor: '#315D48' }, choiceLetterText: { color: palette.green, fontWeight: '700', fontSize: 12 }, choiceLetterTextSelected: { color: '#fff' }, choiceText: { flex: 1, color: palette.ink, fontSize: 13, lineHeight: 19 }, input: { borderWidth: 1, borderColor: palette.line, borderRadius: 14, padding: 16, minHeight: 56, backgroundColor: palette.surface, color: palette.ink },
  buttons: { flexDirection: 'row', gap: 10, marginTop: 23 }, next: { flex: 1, minHeight: 50, flexDirection: 'row', gap: 9, justifyContent: 'center', alignItems: 'center', borderRadius: 14, backgroundColor: '#315D48' }, nextText: { color: '#fff', fontWeight: '700', fontSize: 13 }, back: { minHeight: 50, paddingHorizontal: 14, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', borderRadius: 14, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.surface }, backText: { color: palette.green, fontWeight: '700', fontSize: 12 }, disabled: { opacity: 0.45 },
  resultCard: { alignItems: 'center', backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, borderRadius: 22, padding: 24, marginTop: 24, marginBottom: 20 }, resultIcon: { width: 58, height: 58, borderRadius: 19, backgroundColor: palette.greenLight, alignItems: 'center', justifyContent: 'center' }, resultTitle: { color: '#294638', fontSize: 21, fontWeight: '700', marginTop: 16 }, resultSubtitle: { color: palette.muted, fontSize: 12, marginTop: 5 }, score: { color: '#315D48', fontSize: 40, fontWeight: '800', marginTop: 20 }, scoreTotal: { color: palette.muted, fontSize: 22 }, resultPercent: { color: palette.green, backgroundColor: palette.greenLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, fontSize: 11, fontWeight: '700', marginTop: 8 }, secondaryButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 14, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.surface },
});
