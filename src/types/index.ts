export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
}

export interface HighScore {
  deckId: string;
  deckTitle: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Deck: { deckId: string };
  Quiz: { deckId: string };
  Profile: undefined;
};