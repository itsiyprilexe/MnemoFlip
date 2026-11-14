import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <FormScreenHeader fallbackHref="/quiz" />
    <Text style={styles.title}>{title}</Text>
    {loading ? <ActivityIndicator /> : error ? <Text style={styles.message}>{error}</Text> : questions.length === 0 ? <><Text style={styles.message}>This quiz has no questions yet. Add questions before starting.</Text><AppButton title="Edit quiz" onPress={() => router.replace({ pathname: '/(tabs)/quiz/[id]', params: { id } })} /></> : finished ? <>
      <Text style={styles.heading}>Quiz complete!</Text><Text style={styles.score}>{score} / {questions.length}</Text><Text style={styles.message}>Your score is {Math.round(score / questions.length * 100)}%.</Text>
      <AppButton title="Try again" onPress={() => { setAnswers({}); setIndex(0); setFinished(false); }} style={{ marginBottom: 12 }} />
      <AppButton title="Back to quizzes" onPress={() => router.replace('/quiz')} />
    </> : <>
      <Text style={styles.message}>Question {index + 1} of {questions.length}</Text><Text style={styles.heading}>{question.question}</Text>
      {question.type === 'multipleChoice' ? question.choices.map((choice, i) => <Pressable key={i} accessibilityRole="radio" accessibilityState={{ checked: currentAnswer === choice }} onPress={() => setAnswers(previous => ({ ...previous, [question.id]: choice }))} style={[styles.choice, currentAnswer === choice && styles.selected]}><Text style={styles.choiceText}>{String.fromCharCode(65 + i)}. {choice}</Text></Pressable>) : <TextInput accessibilityLabel="Your answer" value={currentAnswer} onChangeText={value => setAnswers(previous => ({ ...previous, [question.id]: value }))} placeholder="Type your answer" placeholderTextColor={palette.muted} style={styles.input} />}
      <View style={styles.buttons}>{index > 0 && <Pressable accessibilityRole="button" onPress={() => setIndex(index - 1)} style={styles.back}><Text style={styles.backText}>Previous</Text></Pressable>}
      <Pressable accessibilityRole="button" accessibilityState={{ disabled: !currentAnswer.trim() }} disabled={!currentAnswer.trim()} onPress={() => index === questions.length - 1 ? setFinished(true) : setIndex(index + 1)} style={[styles.next, !currentAnswer.trim() && styles.disabled]}><Text style={styles.nextText}>{index === questions.length - 1 ? 'Finish quiz' : 'Next'}</Text></Pressable></View>
    </>}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: palette.background }, page: { padding: 22, paddingBottom: 100 }, title: { fontSize: 27, fontWeight: '700', color: palette.ink }, heading: { fontSize: 19, fontWeight: '700', color: palette.ink, marginVertical: 18 }, score: { color: palette.green, fontSize: 36, fontWeight: '800' }, message: { color: palette.muted, marginVertical: 18 }, choice: { padding: 16, borderRadius: 14, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.surface, marginBottom: 10 }, selected: { borderColor: palette.green, backgroundColor: palette.greenLight }, choiceText: { color: palette.ink }, input: { borderWidth: 1, borderColor: palette.line, borderRadius: 14, padding: 15, backgroundColor: palette.surface, color: palette.ink }, buttons: { flexDirection: 'row', gap: 12, marginTop: 25 }, next: { flex: 1, padding: 16, alignItems: 'center', borderRadius: 14, backgroundColor: palette.green }, nextText: { color: '#fff', fontWeight: '700' }, back: { padding: 16 }, backText: { color: palette.green, fontWeight: '700' }, disabled: { opacity: 0.5 } });
