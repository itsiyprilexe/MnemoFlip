
// my gin change sa declaration san function didi (debuging)
export type Flashcard = {
  id: string;
  question: string;
  answer: string;
}

export type Deck = {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
}

export type HighScore ={
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