import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { listenContent, saveContent, deleteContent } from '../services/contentService';
import type { ItemKind } from '../services/itemService';
import type { QuestionType, StudyContent } from '../types/models';
import { palette } from '../theme';
import { confirmDelete, showDeleteError } from './deleteConfirmation';
import { FlashcardViewer } from './FlashcardViewer';

type ContentManagerProps = {
  kind: ItemKind;
  itemId: string;
  maxItems: number;
  addMode?: boolean;
  deckTitle?: string;
};

export function ContentManager({
  kind,
  itemId,
  maxItems,
  addMode = false,
  deckTitle = '',
}: ContentManagerProps) {
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
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [questionPage, setQuestionPage] = useState(0);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  useEffect(() => {
    setItems([]);
    setLoading(true);
    setError('');

    if (!uid || !itemId) {
      setLoading(false);
      return;
    }

    let active = true;
    const unsubscribe = listenContent(
      uid,
      kind,
      itemId,
      values => {
        if (!active) return;
        setItems(values);
        setLoading(false);
      },
      error => {
        if (!active) return;
        setError(error.message);
        setLoading(false);
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [uid, itemId, kind]);

  useEffect(() => {
    const lastPage = Math.max(0, Math.ceil(items.length / 4) - 1);
    setQuestionPage(page => Math.min(page, lastPage));
  }, [items.length]);

  function reset() {
    setEditing(undefined);
    setQuestion('');
    setAnswer('');
    setChoices(['', '', '', '']);
    setCorrectChoice(null);
    setType(kind === 'deck' ? 'flashcard' : 'multipleChoice');
  }

  async function save() {
    if (!uid || busy) return;
    setBusy(true);

    // Multiple-choice answers come from the selected choice.
    const savedAnswer = kind === 'quiz' && type === 'multipleChoice'
      ? correctChoice === null ? '' : choices[correctChoice]
      : answer;

    try {
      await saveContent(uid, kind, itemId, {
        question,
        answer: savedAnswer,
        type,
        choices,
      }, editing);
      reset();
    } catch (error) {
      showDeleteError('Could not save', error);
    } finally {
      setBusy(false);
    }
  }

  function remove(id: string) {
    confirmDelete('Delete this item?', 'This cannot be undone.', () => {
      if (uid) {
        deleteContent(uid, kind, itemId, id)
          .catch(error => showDeleteError('Could not delete', error));
      }
    });
  }

  function edit(item: StudyContent) {
    setEditing(item.id);
    setQuestion(item.question);
    setAnswer(item.answer);
    setType(item.type);
    setChoices(item.choices.length === 4 ? item.choices : ['', '', '', '']);
    const selected = item.choices.indexOf(item.answer);
    setCorrectChoice(selected < 0 ? null : selected);
  }
  if (kind === 'deck' && addMode) return <View style={formStyles.page}>
    <Text style={formStyles.eyebrow}>A LITTLE MORE KNOWLEDGE</Text>
    <Text style={formStyles.title}>Add flashcard</Text>
    <Text style={formStyles.description}>A question on the front. An answer on the back.</Text>
    <View style={formStyles.deck}><Ionicons name="albums-outline" size={19} color={palette.green} /><Text style={formStyles.deckTitle} numberOfLines={1}>{deckTitle}</Text><Text style={formStyles.count}>{loading ? 'Loading...' : error ? 'Count unavailable' : `Flashcards (${items.length}/${maxItems})`}</Text></View>
    {[{ label: 'Question', side: 'FRONT', value: question, update: setQuestion, hint: 'What do you want to remember?', placeholder: 'Enter a question' }, { label: 'Answer', side: 'BACK', value: answer, update: setAnswer, hint: 'Keep it short and easy to recall.', placeholder: 'Enter the answer' }].map((field, i) => <View key={field.side} style={[formStyles.field, i === 1 && formStyles.backField]}>
      <View style={formStyles.fieldHeader}><View style={[formStyles.tag, i === 1 && formStyles.backTag]}><Text style={[formStyles.tagText, i === 1 && formStyles.backTagText]}>{field.side}</Text></View><Text style={formStyles.fieldTitle}>{field.label}</Text></View>
      <TextInput accessibilityLabel={field.label} multiline maxLength={500} value={field.value} onChangeText={field.update} placeholder={field.placeholder} placeholderTextColor={palette.muted} style={formStyles.input} />
      <Text style={formStyles.fieldHint}>{field.hint}</Text>
    </View>)}
    <View style={formStyles.tip}><View style={formStyles.tipIcon}><Ionicons name="sync-outline" size={20} color={palette.green} /></View><View style={formStyles.tipText}><Text style={formStyles.tipTitle}>Two sides. One idea.</Text><Text style={formStyles.tipDescription}>Tap a saved card to flip between its question and answer.</Text></View></View>
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy || loading || !!error }} disabled={busy || loading || !!error} onPress={save} style={[formStyles.save, (busy || loading || !!error) && formStyles.disabled]}><Ionicons name="add" size={20} color="#fff" /><Text style={formStyles.saveText}>{busy ? 'Saving...' : 'Add flashcard'}</Text></Pressable>
    <Text style={formStyles.saveNote}>Saves to {deckTitle}</Text>
  </View>;
  if (kind === 'quiz') return <View style={quizStyles.section}>
    <View style={quizStyles.headingRow}><View><Text style={quizStyles.heading}>Questions</Text><Text style={quizStyles.subheading}>Build your knowledge check</Text></View><Text style={quizStyles.count}>{items.length} / {maxItems}</Text></View>
    {loading ? <Text style={quizStyles.subheading}>Loading questions...</Text> : error ? <Text style={quizStyles.error}>Could not load questions: {error}</Text> : items.length === 0 ? <View style={quizStyles.empty}><Ionicons name="document-text-outline" size={21} color={palette.green} /><Text style={quizStyles.emptyText}>No questions yet. Add your first one below.</Text></View> : null}
    {items.length > 0 && <><Pressable accessibilityRole="button" accessibilityState={{ expanded: questionsOpen }} accessibilityLabel={`${questionsOpen ? 'Hide' : 'Show'} ${items.length} questions`} onPress={() => { setQuestionsOpen(value => !value); setExpandedQuestion(null); }} style={compactStyles.listToggle}><View style={compactStyles.toggleIcon}><Ionicons name="list-outline" size={19} color={palette.green} /></View><View style={compactStyles.text}><Text style={compactStyles.toggleTitle}>All questions</Text><Text style={compactStyles.type}>{items.length} {items.length === 1 ? 'question' : 'questions'} · Tap to {questionsOpen ? 'hide' : 'view'}</Text></View><Ionicons name={questionsOpen ? 'chevron-up' : 'chevron-down'} size={19} color={palette.green} /></Pressable>{questionsOpen && <><View style={compactStyles.list}>{items.slice(questionPage * 4, questionPage * 4 + 4).map((item, index, pageItems) => <View key={item.id} style={[compactStyles.item, index < pageItems.length - 1 && compactStyles.divider]}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: expandedQuestion === item.id }} accessibilityLabel={`${item.question}. ${expandedQuestion === item.id ? 'Hide details' : 'Show details'}`} onPress={() => setExpandedQuestion(value => value === item.id ? null : item.id)} style={compactStyles.header}>
        <Text style={compactStyles.numberText}>{String(questionPage * 4 + index + 1).padStart(2, '0')}</Text>
        <View style={compactStyles.text}><Text style={quizStyles.questionText} numberOfLines={expandedQuestion === item.id ? undefined : 2}>{item.question}</Text><Text style={compactStyles.type}>{item.type === 'multipleChoice' ? 'Multiple choice' : 'Identification'}</Text></View>
        <Ionicons name={expandedQuestion === item.id ? 'chevron-up' : 'chevron-down'} size={18} color={palette.green} />
      </Pressable>
      {expandedQuestion === item.id && <View style={compactStyles.details}>
        {item.type === 'multipleChoice' && item.choices.map((choice, i) => <Text key={i} style={quizStyles.choiceText}>{String.fromCharCode(65 + i)}. {choice}</Text>)}
        <Text style={quizStyles.answerText}>Answer: {item.answer}</Text>
        <View style={quizStyles.cardActions}><Pressable accessibilityRole="button" onPress={() => edit(item)} style={quizStyles.actionButton}><Ionicons name="create-outline" size={16} color={palette.green} /><Text style={quizStyles.actionText}>Edit</Text></Pressable><Pressable accessibilityRole="button" onPress={() => remove(item.id)} style={quizStyles.actionButton}><Ionicons name="trash-outline" size={16} color="#A64E46" /><Text style={quizStyles.deleteText}>Delete</Text></Pressable></View>
      </View>}
    </View>)}</View>{items.length > 4 && <View style={compactStyles.pagination}><Text style={compactStyles.pageText}>Showing {questionPage * 4 + 1}–{Math.min(questionPage * 4 + 4, items.length)} of {items.length}</Text><View style={compactStyles.pageButtons}><Pressable accessibilityRole="button" accessibilityLabel="Previous questions" accessibilityState={{ disabled: questionPage === 0 }} disabled={questionPage === 0} onPress={() => { setQuestionPage(page => page - 1); setExpandedQuestion(null); }} style={[compactStyles.pageButton, questionPage === 0 && compactStyles.pageDisabled]}><Ionicons name="chevron-back" size={18} color={palette.green} /></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Next questions" accessibilityState={{ disabled: (questionPage + 1) * 4 >= items.length }} disabled={(questionPage + 1) * 4 >= items.length} onPress={() => { setQuestionPage(page => page + 1); setExpandedQuestion(null); }} style={[compactStyles.pageButton, (questionPage + 1) * 4 >= items.length && compactStyles.pageDisabled]}><Ionicons name="chevron-forward" size={18} color={palette.green} /></Pressable></View></View>}</>}</>}
    <View style={quizStyles.form}><Text style={quizStyles.formTitle}>{editing ? 'Edit question' : 'Add a question'}</Text><Text style={quizStyles.subheading}>Choose a question type to get started.</Text>
      <View style={quizStyles.tabs}>{(['multipleChoice', 'identification'] as const).map(t => <Pressable key={t} accessibilityRole="button" accessibilityState={{ selected: type === t }} onPress={() => { if (type !== t) { setType(t); setAnswer(''); setCorrectChoice(null); } }} style={[quizStyles.tab, type === t && quizStyles.activeTab]}><Text style={[quizStyles.tabText, type === t && quizStyles.activeTabText]}>{t === 'multipleChoice' ? 'Multiple choice' : 'Identification'}</Text></Pressable>)}</View>
      <View style={quizStyles.inputCard}><Text style={quizStyles.inputLabel}>QUESTION</Text><TextInput accessibilityLabel="Question" value={question} onChangeText={setQuestion} placeholder="What would you like to ask?" placeholderTextColor={palette.muted} multiline maxLength={500} style={quizStyles.questionInput} /></View>
      {type === 'multipleChoice' ? <><Text style={quizStyles.formLabel}>Answer choices</Text><Text style={quizStyles.subheading}>Add four different choices and select the correct one.</Text>{choices.map((choice, i) => <View key={i} style={quizStyles.choiceRow}><View style={quizStyles.choiceLetter}><Text style={quizStyles.choiceLetterText}>{String.fromCharCode(65 + i)}</Text></View><TextInput accessibilityLabel={`Choice ${String.fromCharCode(65 + i)}`} value={choice} onChangeText={value => setChoices(previous => previous.map((item, index) => index === i ? value : item))} placeholder={`Enter choice ${String.fromCharCode(65 + i)}`} placeholderTextColor={palette.muted} maxLength={200} style={quizStyles.choiceInput} /><Pressable accessibilityRole="radio" accessibilityLabel={`Mark choice ${String.fromCharCode(65 + i)} as correct`} accessibilityState={{ checked: correctChoice === i }} onPress={() => setCorrectChoice(i)} style={quizStyles.radio}><Ionicons name={correctChoice === i ? 'checkmark-circle' : 'ellipse-outline'} size={23} color={correctChoice === i ? palette.green : palette.muted} /></Pressable></View>)}</> : <View style={quizStyles.inputCard}><Text style={quizStyles.inputLabel}>CORRECT ANSWER</Text><TextInput accessibilityLabel="Correct answer" value={answer} onChangeText={setAnswer} placeholder="Enter the correct answer" placeholderTextColor={palette.muted} multiline maxLength={500} style={quizStyles.answerInput} /></View>}
      <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy || loading || !!error }} disabled={busy || loading || !!error} onPress={save} style={[quizStyles.save, (busy || loading || !!error) && quizStyles.disabled]}><Ionicons name={editing ? 'checkmark' : 'add'} size={19} color="#fff" /><Text style={quizStyles.saveText}>{busy ? 'Saving...' : editing ? 'Save changes' : 'Add question'}</Text></Pressable>
      {editing && <Pressable accessibilityRole="button" onPress={reset} style={quizStyles.cancel}><Text style={quizStyles.actionText}>Cancel editing</Text></Pressable>}
    </View>
  </View>;
  return <View style={styles.section}>
    <Text style={styles.heading}>Flashcards ({items.length}/{maxItems})</Text>
    {loading ? <Text>Loading...</Text> : error ? <Text>Could not load: {error}</Text> : items.length === 0 ? <Text>No flashcards yet.</Text> : null}
    <FlashcardViewer items={items} />
  </View>;
}
const styles = StyleSheet.create({ section: { marginTop: 24, gap: 12 }, heading: { fontWeight: '700', fontSize: 16, color: palette.ink }, card: { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, borderRadius: 14, padding: 14, gap: 8 }, row: { flexDirection: 'row', gap: 25, marginVertical: 8 }, link: { color: palette.green, fontWeight: '700', paddingVertical: 8 }, selected: { color: palette.green, fontWeight: '800', paddingVertical: 8, textDecorationLine: 'underline' }, danger: { color: '#A64E46', fontWeight: '700', paddingVertical: 8 }, hint: { color: palette.muted } });
const compactStyles = StyleSheet.create({ listToggle: { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 68 }, toggleIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: palette.greenLight, alignItems: 'center', justifyContent: 'center' }, toggleTitle: { color: '#294638', fontSize: 14, fontWeight: '700' }, list: { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, borderRadius: 18, paddingHorizontal: 16 }, item: { paddingVertical: 4 }, divider: { borderBottomWidth: 1, borderBottomColor: palette.line }, header: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 54 }, numberText: { color: palette.muted, fontWeight: '700', fontSize: 11, width: 20 }, text: { flex: 1 }, type: { color: palette.muted, fontSize: 11, marginTop: 4 }, details: { marginLeft: 34, paddingBottom: 6, gap: 9 }, pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: -4 }, pageText: { color: palette.muted, fontSize: 11 }, pageButtons: { flexDirection: 'row', gap: 8 }, pageButton: { width: 40, height: 40, borderRadius: 13, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, alignItems: 'center', justifyContent: 'center' }, pageDisabled: { opacity: 0.35 } });
const quizStyles = StyleSheet.create({ section: { marginTop: 25, gap: 13 }, headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, heading: { color: '#294638', fontWeight: '700', fontSize: 19 }, subheading: { color: palette.muted, fontSize: 11, lineHeight: 16, marginTop: 4 }, count: { color: palette.green, backgroundColor: palette.greenLight, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, fontWeight: '700', fontSize: 11 }, error: { color: '#A64E46' }, empty: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: palette.greenLight, borderRadius: 15, padding: 14 }, emptyText: { color: '#496455', fontSize: 12, flex: 1 }, questionCard: { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, borderRadius: 18, padding: 16, gap: 8 }, cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }, cardNumber: { color: palette.muted, fontWeight: '700', fontSize: 9, letterSpacing: 1 }, typeBadge: { color: palette.green, backgroundColor: palette.greenLight, borderRadius: 10, overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 5, fontSize: 10, fontWeight: '700' }, questionText: { color: '#294638', fontWeight: '700', fontSize: 15, lineHeight: 21 }, choiceText: { color: palette.ink, fontSize: 12 }, answerText: { color: palette.green, fontSize: 12, fontWeight: '700' }, cardActions: { flexDirection: 'row', gap: 20, borderTopWidth: 1, borderTopColor: palette.line, paddingTop: 8 }, actionButton: { minHeight: 40, flexDirection: 'row', alignItems: 'center', gap: 5 }, actionText: { color: palette.green, fontWeight: '700', fontSize: 12 }, deleteText: { color: '#A64E46', fontWeight: '700', fontSize: 12 }, form: { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, borderRadius: 20, padding: 16, marginTop: 8 }, formTitle: { color: '#294638', fontSize: 18, fontWeight: '700' }, tabs: { flexDirection: 'row', backgroundColor: palette.background, borderRadius: 13, padding: 4, gap: 4, marginVertical: 16 }, tab: { flex: 1, minHeight: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 }, activeTab: { backgroundColor: '#315D48' }, tabText: { color: palette.green, fontSize: 11, fontWeight: '700', textAlign: 'center' }, activeTabText: { color: '#fff' }, inputCard: { borderWidth: 1, borderColor: palette.line, backgroundColor: palette.background, borderRadius: 14, padding: 13, marginBottom: 14 }, inputLabel: { color: palette.green, fontSize: 9, fontWeight: '700', letterSpacing: 1 }, questionInput: { color: palette.ink, minHeight: 82, paddingTop: 10, textAlignVertical: 'top', fontSize: 13 }, answerInput: { color: palette.ink, minHeight: 55, paddingTop: 10, textAlignVertical: 'top', fontSize: 13 }, formLabel: { color: '#294638', fontWeight: '700', fontSize: 13 }, choiceRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: palette.line, borderRadius: 13, marginTop: 10, paddingLeft: 10 }, choiceLetter: { backgroundColor: palette.greenLight, width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }, choiceLetterText: { color: palette.green, fontWeight: '700', fontSize: 11 }, choiceInput: { flex: 1, minHeight: 48, paddingHorizontal: 10, color: palette.ink, fontSize: 12 }, radio: { width: 44, minHeight: 48, alignItems: 'center', justifyContent: 'center' }, save: { marginTop: 18, minHeight: 48, borderRadius: 13, backgroundColor: '#315D48', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, saveText: { color: '#fff', fontWeight: '700', fontSize: 13 }, disabled: { opacity: 0.5 }, cancel: { alignItems: 'center', padding: 12 } });
const formStyles = StyleSheet.create({ page: { paddingTop: 14 }, eyebrow: { color: palette.muted, fontSize: 9, letterSpacing: 1.4, fontWeight: '700', marginBottom: 12 }, title: { color: '#294638', fontSize: 28, fontWeight: '700' }, description: { color: palette.muted, fontSize: 12, marginTop: 7, marginBottom: 20 }, deck: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: palette.surface, borderColor: palette.line, borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 18 }, deckTitle: { flex: 1, fontSize: 13, fontWeight: '700', color: '#294638' }, count: { fontSize: 10, color: palette.muted }, field: { borderWidth: 1, borderColor: palette.line, borderRadius: 18, backgroundColor: palette.surface, padding: 14, marginBottom: 14 }, backField: { backgroundColor: '#EAF0E6' }, fieldHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: palette.line, paddingBottom: 12 }, tag: { backgroundColor: palette.greenLight, borderRadius: 7, paddingHorizontal: 9, paddingVertical: 6 }, tagText: { fontSize: 9, fontWeight: '700', color: palette.green }, backTag: { backgroundColor: '#315D48' }, backTagText: { color: '#fff' }, fieldTitle: { color: '#294638', fontWeight: '700', fontSize: 13 }, input: { minHeight: 72, textAlignVertical: 'top', color: palette.ink, paddingVertical: 14, fontSize: 14 }, fieldHint: { color: palette.muted, fontSize: 10 }, tip: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 24 }, tipIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: palette.greenLight, alignItems: 'center', justifyContent: 'center' }, tipText: { flex: 1 }, tipTitle: { color: '#294638', fontSize: 12, fontWeight: '700' }, tipDescription: { color: palette.muted, fontSize: 11, lineHeight: 16, marginTop: 3 }, save: { backgroundColor: '#315D48', borderRadius: 14, minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }, saveText: { color: '#fff', fontWeight: '700', fontSize: 13 }, disabled: { opacity: 0.5 }, saveNote: { color: palette.muted, fontSize: 10, textAlign: 'center', marginTop: 10 } });
