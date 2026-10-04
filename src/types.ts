import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  HomeTab: undefined;
  DecksTab: undefined;
  QuizTab: undefined;
  ProfileTab: undefined;
};

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
};

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  Main: NavigatorScreenParams<TabParamList>;
  Home: undefined;
  Deck: { deckId: string };
  Quiz: { deckId?: string; quizId?: string };
  QuizEditor: { quizId: string };
  Profile: undefined;
};