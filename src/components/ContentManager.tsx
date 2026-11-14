import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { listenContent, saveContent, deleteContent } from '../services/contentService';
import type { ItemKind } from '../services/itemService';
import type { QuestionType, StudyContent } from '../types/models';
import { TextField } from './TextField';
import { AppButton } from './AppButton';
import { palette } from '../theme';
import { confirmDelete, showDeleteError } from './deleteConfirmation';

export function ContentManager({ kind, itemId, maxItems, addMode = false }: { kind: ItemKind; itemId: string; maxItems: number; addMode?: boolean }) {
  const { user } = useAuth();
  const uid = user?.uid;
  const [items, setItems] = useState<StudyContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<string | undefined>();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [type, setType] = useState<QuestionType>(kind === 'deck' ? 'flashcard' : 'multipleChoice');
  const [choices, setChoices] = useState(['', '', '', '']);
  const [correctChoice, setCorrectChoice] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [flipped, setFlipped] = useState<string | null>(null);
  useEffect(() => {
    setItems([]); setLoading(true); setError('');
    if (!uid || !itemId) { setLoading(false); return; }
    let active = true;
    const stop = listenContent(uid, kind, itemId, values => { if (active) { setItems(values); setLoading(false); } }, e => { if (active) { setError(e.message); setLoading(false); } });
    return () => { active = false; stop(); };
  }, [uid, itemId, kind]);
  const reset = () => { setEditing(undefined); setQuestion(''); setAnswer(''); setChoices(['', '', '', '']); setCorrectChoice(null); setType(kind === 'deck' ? 'flashcard' : 'multipleChoice'); };
  const save = async () => {
    if (!uid || busy) return;
    setBusy(true);
    try { await saveContent(uid, kind, itemId, { question, answer: kind === 'quiz' && type === 'multipleChoice' ? (correctChoice === null ? '' : choices[correctChoice]) : answer, type, choices }, editing); reset(); }
    catch (e) { showDeleteError('Could not save', e); }
    finally { setBusy(false); }
  };
  const remove = (id: string) => confirmDelete('Delete this item?', 'This cannot be undone.', () => {
    if (uid) deleteContent(uid, kind, itemId, id).catch(error => showDeleteError('Could not delete', error));
  });
  return <View style={styles.section}>
    <Text style={styles.heading}>{kind === 'deck' ? 'Flashcards' : 'Questions'} ({items.length}/{maxItems})</Text>
    {loading ? <Text>Loading...</Text> : error ? <Text>Could not load: {error}</Text> : items.length === 0 ? <Text>No {kind === 'deck' ? 'flashcards' : 'questions'} yet.</Text> : null}
    {!addMode && items.map((item, index) => <View style={styles.card} key={item.id}>
      <Text style={styles.heading}>{index + 1}. {item.question}</Text>
      {kind === 'deck' ? <Pressable accessibilityRole="button" onPress={() => setFlipped(flipped === item.id ? null : item.id)}><Text style={styles.link}>{flipped === item.id ? item.answer : 'Tap to reveal answer'}</Text></Pressable> : <><Text>{item.type === 'multipleChoice' ? 'Multiple choice' : 'Identification'}</Text>{item.choices.map((choice, i) => <Text key={i}>{String.fromCharCode(65 + i)}. {choice}</Text>)}<Text>Answer: {item.answer}</Text></>}
      <View style={styles.row}><Pressable accessibilityRole="button" onPress={() => { setEditing(item.id); setQuestion(item.question); setAnswer(item.answer); setType(item.type); setChoices(item.choices.length === 4 ? item.choices : ['', '', '', '']); const selected = item.choices.indexOf(item.answer); setCorrectChoice(selected < 0 ? null : selected); }}><Text style={styles.link}>Edit</Text></Pressable><Pressable accessibilityRole="button" onPress={() => remove(item.id)}><Text style={styles.danger}>Delete</Text></Pressable></View>
    </View>)}
    {(kind === 'quiz' || addMode || editing) && <>
    <Text style={styles.heading}>{editing ? 'Edit' : 'Add'} {kind === 'deck' ? 'flashcard' : 'question'}</Text>
    {kind === 'quiz' && <View style={styles.row}>{(['multipleChoice', 'identification'] as const).map(t => <Pressable accessibilityRole="button" key={t} onPress={() => { if (type !== t) { setType(t); setAnswer(''); setCorrectChoice(null); } }}><Text style={type === t ? styles.selected : styles.link}>{t === 'multipleChoice' ? 'Multiple choice' : 'Identification'}</Text></Pressable>)}</View>}
    <TextField label="Question" value={question} onChangeText={setQuestion} placeholder="Enter a question" multiline maxLength={500} />
    {type === 'multipleChoice' && kind === 'quiz' ? <><Text style={styles.hint}>Enter four choices, then tap the correct answer.</Text>{choices.map((choice, i) => <View key={i}><TextField label={`Choice ${String.fromCharCode(65 + i)}`} value={choice} onChangeText={value => setChoices(previous => previous.map((item, index) => index === i ? value : item))} maxLength={200} /><Pressable accessibilityRole="radio" accessibilityState={{ checked: correctChoice === i }} onPress={() => setCorrectChoice(i)}><Text style={correctChoice === i ? styles.selected : styles.link}>{correctChoice === i ? 'Correct answer selected' : 'Mark as correct'}</Text></Pressable></View>)}</> : <TextField label="Answer" value={answer} onChangeText={setAnswer} placeholder="Enter the answer" multiline maxLength={500} />}
    <AppButton title={busy ? 'Saving...' : editing ? 'Save changes' : `Add ${kind === 'deck' ? 'flashcard' : 'question'}`} onPress={save} />
    {editing && <Pressable accessibilityRole="button" onPress={reset}><Text style={styles.link}>Cancel editing</Text></Pressable>}
    </>}
  </View>;
}
const styles = StyleSheet.create({ section: { marginTop: 24, gap: 12 }, heading: { fontWeight: '700', fontSize: 16, color: palette.ink }, card: { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, borderRadius: 14, padding: 14, gap: 8 }, row: { flexDirection: 'row', gap: 25, marginVertical: 8 }, link: { color: palette.green, fontWeight: '700', paddingVertical: 8 }, selected: { color: palette.green, fontWeight: '800', paddingVertical: 8, textDecorationLine: 'underline' }, danger: { color: '#A64E46', fontWeight: '700', paddingVertical: 8 }, hint: { color: palette.muted } });
