import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { ItemKind } from './itemService';
import type { QuestionType, StudyContent } from '../types/models';

type ContentInput = {
  question: string;
  answer: string;
  type: QuestionType;
  choices: string[];
};

function parent(uid: string, kind: ItemKind, id: string) {
  const collectionName = kind === 'deck' ? 'decks' : 'quizzes';
  return doc(db, 'users', uid, collectionName, id);
}

function children(uid: string, kind: ItemKind, id: string) {
  const collectionName = kind === 'deck' ? 'cards' : 'questions';
  return collection(parent(uid, kind, id), collectionName);
}

export function listenContent(
  uid: string,
  kind: ItemKind,
  id: string,
  onData: (items: StudyContent[]) => void,
  onError: (error: Error) => void
) {
  const contentQuery = query(children(uid, kind, id), orderBy('createdAt'));

  return onSnapshot(contentQuery, snapshot => {
    const items = snapshot.docs.map(item => {
      const data = item.data();
      return {
        id: item.id,
        question: data.question ?? '',
        answer: data.answer ?? '',
        type: data.type ?? (kind === 'deck' ? 'flashcard' : 'identification'),
        choices: Array.isArray(data.choices) ? data.choices : [],
      };
    });
    onData(items);
  }, onError);
}

export async function saveContent(
  uid: string,
  kind: ItemKind,
  parentId: string,
  data: ContentInput,
  id?: string
) {
  const question = data.question.trim();
  const answer = data.answer.trim();
  if (!question || !answer) throw new Error('Enter a question and an answer.');

  const choices = data.type === 'multipleChoice'
    ? data.choices.map(choice => choice.trim())
    : [];

  if (data.type === 'multipleChoice') {
    const hasFourChoices = choices.length === 4;
    const hasEmptyChoice = choices.some(choice => !choice);
    const uniqueChoices = new Set(choices.map(choice => choice.toLowerCase()));
    const answerIsAChoice = choices.includes(answer);

    if (!hasFourChoices || hasEmptyChoice || uniqueChoices.size !== 4 || !answerIsAChoice) {
      throw new Error('Enter four different choices and select the correct answer.');
    }
  }

  const parentRef = parent(uid, kind, parentId);
  const contentRef = id
    ? doc(children(uid, kind, parentId), id)
    : doc(children(uid, kind, parentId));

  await runTransaction(db, async transaction => {
    const owner = await transaction.get(parentRef);
    if (!owner.exists()) throw new Error('This item no longer exists.');

    if (id) {
      const existing = await transaction.get(contentRef);
      if (!existing.exists()) throw new Error('This question no longer exists.');
    }

    const count = owner.data().itemCount ?? 0;
    const maximum = owner.data().maxItems ?? 100;
    if (!id && count >= maximum) {
      throw new Error('Maximum reached. Edit the maximum before adding more.');
    }

    const fields = { question, answer, type: kind === 'deck' ? 'flashcard' : data.type, choices };
    if (id) {
      transaction.update(contentRef, fields);
    } else {
      // Save the item and its updated parent count together.
      transaction.set(contentRef, { ...fields, createdAt: serverTimestamp() });
      transaction.update(parentRef, { itemCount: count + 1 });
    }
  });
}

export async function deleteContent(uid: string, kind: ItemKind, parentId: string, id: string) {
  const parentRef = parent(uid, kind, parentId);
  const contentRef = doc(children(uid, kind, parentId), id);

  await runTransaction(db, async transaction => {
    const owner = await transaction.get(parentRef);
    const existing = await transaction.get(contentRef);
    if (!owner.exists() || !existing.exists()) throw new Error('This item no longer exists.');

    const count = owner.data().itemCount ?? 0;
    transaction.delete(contentRef);
    transaction.update(parentRef, { itemCount: Math.max(0, count - 1) });
  });
}

export async function getQuizQuestions(uid: string, id: string): Promise<StudyContent[]> {
  const questionsQuery = query(children(uid, 'quiz', id), orderBy('createdAt'));
  const snapshot = await getDocs(questionsQuery);

  return snapshot.docs.map(item => {
    const data = item.data();
    return {
      id: item.id,
      question: typeof data.question === 'string' ? data.question : '',
      answer: typeof data.answer === 'string' ? data.answer : '',
      type: data.type === 'multipleChoice' ? 'multipleChoice' : 'identification',
      choices: Array.isArray(data.choices)
        ? data.choices.filter((choice: unknown): choice is string => typeof choice === 'string')
        : [],
    };
  });
}
