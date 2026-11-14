import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc, runTransaction } from 'firebase/firestore';
import { db } from './firebase';
import type { StudyItem } from '../types/models';
export type ItemKind = 'deck' | 'quiz';
const collectionName = (kind: ItemKind) => kind === 'deck' ? 'decks' : 'quizzes';
const items = (uid: string, kind: ItemKind) => collection(db, 'users', uid, collectionName(kind));
const itemRef = (uid: string, kind: ItemKind, id: string) => doc(db, 'users', uid, collectionName(kind), id);
const parseItem = (id: string, data: Record<string, any>): StudyItem => ({ id, title: typeof data.title === 'string' ? data.title : '', description: typeof data.description === 'string' ? data.description : '', createdAt: data.createdAt ?? null, maxItems: typeof data.maxItems === 'number' ? data.maxItems : 100, itemCount: typeof data.itemCount === 'number' ? data.itemCount : 0 });
export function listenToItems(uid: string, kind: ItemKind, onData: (items: StudyItem[]) => void, onError: (error: Error) => void) {
  return onSnapshot(query(items(uid, kind), orderBy('createdAt', 'desc')), snapshot => onData(snapshot.docs.map(item => parseItem(item.id, item.data()))), onError);
}
export async function getItem(uid: string, kind: ItemKind, id: string) {
  const snapshot = await getDoc(itemRef(uid, kind, id));
  return snapshot.exists() ? parseItem(snapshot.id, snapshot.data()) : null;
}
export async function saveItem(uid: string, kind: ItemKind, title: string, description: string, maxItems: number, id?: string) {
  const cleanTitle = title.trim();
  if (!cleanTitle) throw new Error(`Please enter a ${kind} name.`);
  if (!Number.isInteger(maxItems) || maxItems < 1 || maxItems > 100) throw new Error('Maximum must be a whole number from 1 to 100.');
  const fields = { title: cleanTitle, description: description.trim(), maxItems };
  if (id) {
    const ref = itemRef(uid, kind, id);
    await runTransaction(db, async tx => {
      const existing = await tx.get(ref);
      if (!existing.exists()) throw new Error('This item no longer exists.');
      if ((existing.data().itemCount ?? 0) > maxItems) throw new Error('Maximum cannot be less than the current number of cards or questions.');
      tx.update(ref, fields);
    });
    return id;
  }
  const created = await addDoc(items(uid, kind), { ...fields, itemCount: 0, createdAt: serverTimestamp() });
  return created.id;
}
export async function deleteItem(uid: string, kind: ItemKind, id: string) {
  const ref = itemRef(uid, kind, id);
  if (kind === 'quiz') {
    const questions = await getDocs(collection(ref, 'questions'));
    if (questions.size > 100) throw new Error('This quiz has too many questions to delete at once.');
    await runTransaction(db, async tx => {
      const snapshot = await tx.get(ref);
      if (!snapshot.exists()) throw new Error('This quiz no longer exists.');
      if ((snapshot.data().itemCount ?? 0) !== questions.size) throw new Error('The quiz changed. Please try deleting it again.');
      for (const question of questions.docs) tx.delete(question.ref);
      tx.delete(ref);
    });
    return;
  }
  const children = await getDocs(query(collection(ref, kind === 'deck' ? 'cards' : 'questions'), limit(1)));
  if (!children.empty) throw new Error(`Remove all ${kind === 'deck' ? 'flashcards' : 'questions'} before deleting this ${kind}.`);
  await runTransaction(db, async tx => { const snapshot = await tx.get(ref); if (!snapshot.exists()) throw new Error('This item no longer exists.'); if ((snapshot.data().itemCount ?? 0) > 0) throw new Error('Remove all cards or questions before deleting.'); tx.delete(ref); });
}
