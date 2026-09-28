// Merge into your existing src/types.ts
import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  HomeTab: undefined;
  DecksTab: undefined;
  QuizTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Main: NavigatorScreenParams<TabParamList>;
  // keep your existing routes (Deck, Quiz, AddCard, CreateDeck, ...)
  // and REMOVE 'Home' and 'Profile'
};