import type { Timestamp } from 'firebase/firestore';
export type StudyItem = { id: string; title: string; description: string; createdAt: Timestamp | null; maxItems: number; itemCount: number };
export type Deck = StudyItem;
export type Quiz = StudyItem;
export type QuestionType = 'flashcard' | 'multipleChoice' | 'identification';
export type StudyContent = { id: string; question: string; answer: string; type: QuestionType; choices: string[] };
