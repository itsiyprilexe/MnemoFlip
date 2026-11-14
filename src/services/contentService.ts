import { collection, doc, getDocs, onSnapshot, query, orderBy, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { ItemKind } from './itemService';
import type { QuestionType, StudyContent } from '../types/models';
const parent = (uid: string, kind: ItemKind, id: string) => doc(db, 'users', uid, kind === 'deck' ? 'decks' : 'quizzes', id);
const children = (uid: string, kind: ItemKind, id: string) => collection(parent(uid, kind, id), kind === 'deck' ? 'cards' : 'questions');
export function listenContent(uid: string, kind: ItemKind, id: string, onData: (items: StudyContent[]) => void, onError: (err: Error) => void) {
  return onSnapshot(query(children(uid, kind, id), orderBy('createdAt')), snap => onData(snap.docs.map(d => { const v = d.data(); return { id: d.id, question: v.question ?? '', answer: v.answer ?? '', type: v.type ?? (kind === 'deck' ? 'flashcard' : 'identification'), choices: Array.isArray(v.choices) ? v.choices : [] }; })), onError);
}
export async function saveContent(uid: string, kind: ItemKind, parentId: string, data: { question: string; answer: string; type: QuestionType; choices: string[] }, id?: string) {
  const question = data.question.trim(), answer = data.answer.trim();
  if (!question || !answer) throw new Error('Enter a question and an answer.');
  const choices = data.type === 'multipleChoice' ? data.choices.map(x => x.trim()) : [];
  if (data.type === 'multipleChoice' && (choices.length !== 4 || choices.some(x => !x) || new Set(choices.map(x => x.toLowerCase())).size !== 4 || !choices.includes(answer))) throw new Error('Enter four different choices and select the correct answer.');
  const parentRef = parent(uid, kind, parentId);
  const ref = id ? doc(children(uid, kind, parentId), id) : doc(children(uid, kind, parentId));
  await runTransaction(db, async tx => {
    const owner = await tx.get(parentRef);
    if (!owner.exists()) throw new Error('This item no longer exists.');
    if (id) { const existing = await tx.get(ref); if (!existing.exists()) throw new Error('This question no longer exists.'); }
    const count = owner.data().itemCount ?? 0;
    if (!id && count >= (owner.data().maxItems ?? 100)) throw new Error('Maximum reached. Edit the maximum before adding more.');
    const fields = { question, answer, type: kind === 'deck' ? 'flashcard' : data.type, choices };
    if (id) tx.update(ref, fields); else { tx.set(ref, { ...fields, createdAt: serverTimestamp() }); tx.update(parentRef, { itemCount: count + 1 }); }
  });
}
export async function deleteContent(uid: string, kind: ItemKind, parentId: string, id: string) {
  const parentRef = parent(uid, kind, parentId), ref = doc(children(uid, kind, parentId), id);
  await runTransaction(db, async tx => {
    const owner = await tx.get(parentRef), existing = await tx.get(ref);
    if (!owner.exists() || !existing.exists()) throw new Error('This item no longer exists.');
    tx.delete(ref); tx.update(parentRef, { itemCount: Math.max(0, (owner.data().itemCount ?? 0) - 1) });
  });
}

export async function getQuizQuestions(uid: string, id: string): Promise<StudyContent[]> {
  const snapshot = await getDocs(query(children(uid, 'quiz', id), orderBy('createdAt')));
  return snapshot.docs.map(d => {
    const v = d.data();
    return { id: d.id, question: typeof v.question === 'string' ? v.question : '', answer: typeof v.answer === 'string' ? v.answer : '', type: v.type === 'multipleChoice' ? 'multipleChoice' : 'identification', choices: Array.isArray(v.choices) ? v.choices.filter((x: unknown): x is string => typeof x === 'string') : [] };
  });
}
