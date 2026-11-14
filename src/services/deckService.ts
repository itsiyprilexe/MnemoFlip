import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Deck } from '../types/models';

const decksRef = (uid: string) => collection(db, 'users', uid, 'decks');
export function listenToDecks(uid: string, onData: (decks: Deck[]) => void, onError: (error: Error) => void) {
  return onSnapshot(query(decksRef(uid), orderBy('createdAt', 'desc')), snapshot => {
    onData(snapshot.docs.map(item => {
      const data = item.data();
      return { id: item.id, title: typeof data.title === 'string' ? data.title : '', description: typeof data.description === 'string' ? data.description : '', createdAt: data.createdAt ?? null, maxItems: typeof data.maxItems === 'number' ? data.maxItems : 100, itemCount: typeof data.itemCount === 'number' ? data.itemCount : 0 };
    }));
  }, onError);
}
export async function createDeck(uid: string, title: string, description: string) {
  if (!title.trim()) throw new Error('Please enter a deck name.');
  return addDoc(decksRef(uid), { title: title.trim(), description: description.trim(), createdAt: serverTimestamp() });
}
