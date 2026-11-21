import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { StudyItem } from '../types/models';

export type ItemKind = 'deck' | 'quiz';

function collectionName(kind: ItemKind) {
  return kind === 'deck' ? 'decks' : 'quizzes';
}

function items(uid: string, kind: ItemKind) {
  return collection(db, 'users', uid, collectionName(kind));
}

function itemRef(uid: string, kind: ItemKind, id: string) {
  return doc(db, 'users', uid, collectionName(kind), id);
}

function parseItem(id: string, data: Record<string, any>): StudyItem {
  return {
    id,
    title: typeof data.title === 'string' ? data.title : '',
    description: typeof data.description === 'string' ? data.description : '',
    createdAt: data.createdAt ?? null,
    maxItems: typeof data.maxItems === 'number' ? data.maxItems : 100,
    itemCount: typeof data.itemCount === 'number' ? data.itemCount : 0,
  };
}

export function listenToItems(
  uid: string,
  kind: ItemKind,
  onData: (items: StudyItem[]) => void,
  onError: (error: Error) => void
) {
  const itemsQuery = query(items(uid, kind), orderBy('createdAt', 'desc'));
  return onSnapshot(itemsQuery, snapshot => {
    const list = snapshot.docs.map(item => parseItem(item.id, item.data()));
    onData(list);
  }, onError);
}

export async function getItem(uid: string, kind: ItemKind, id: string) {
  const snapshot = await getDoc(itemRef(uid, kind, id));
  return snapshot.exists() ? parseItem(snapshot.id, snapshot.data()) : null;
}

export async function saveItem(
  uid: string,
  kind: ItemKind,
  title: string,
  description: string,
  maxItems: number,
  id?: string
) {
  const cleanTitle = title.trim();
  if (!cleanTitle) throw new Error(`Please enter a ${kind} name.`);
  if (!Number.isInteger(maxItems) || maxItems < 1 || maxItems > 100) {
    throw new Error('Maximum must be a whole number from 1 to 100.');
  }

  const fields = { title: cleanTitle, description: description.trim(), maxItems };
  if (id) {
    const ref = itemRef(uid, kind, id);
    await runTransaction(db, async transaction => {
      const existing = await transaction.get(ref);
      if (!existing.exists()) throw new Error('This item no longer exists.');
      if ((existing.data().itemCount ?? 0) > maxItems) {
        throw new Error('Maximum cannot be less than the current number of cards or questions.');
      }
      transaction.update(ref, fields);
    });
    return id;
  }

  const created = await addDoc(items(uid, kind), {
    ...fields,
    itemCount: 0,
    createdAt: serverTimestamp(),
  });
  return created.id;
}

export async function deleteItem(uid: string, kind: ItemKind, id: string) {
  const ref = itemRef(uid, kind, id);

  if (kind === 'quiz') {
    const questions = await getDocs(collection(ref, 'questions'));
    if (questions.size > 100) throw new Error('This quiz has too many questions to delete at once.');

    await runTransaction(db, async transaction => {
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists()) throw new Error('This quiz no longer exists.');
      if ((snapshot.data().itemCount ?? 0) !== questions.size) {
        throw new Error('The quiz changed. Please try deleting it again.');
      }
      for (const question of questions.docs) transaction.delete(question.ref);
      transaction.delete(ref);
    });
    return;
  }

  // Decks can only be deleted after their flashcards are removed.
  const cards = await getDocs(query(collection(ref, 'cards'), limit(1)));
  if (!cards.empty) throw new Error('Remove all flashcards before deleting this deck.');

  await runTransaction(db, async transaction => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists()) throw new Error('This item no longer exists.');
    if ((snapshot.data().itemCount ?? 0) > 0) {
      throw new Error('Remove all cards or questions before deleting.');
    }
    transaction.delete(ref);
  });
}
