import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../theme';

export type StudyCollection = {
  id: string;
  title: string;
  detail: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  tint: string;
  color: string;
};

export const collections: StudyCollection[] = [
  { id: 'visual-arts', title: 'Visual arts', detail: '18 cards · 4 topics', icon: 'color-palette-outline', tint: palette.lilac, color: '#786798' },
  { id: 'plant-science', title: 'Plant science', detail: '24 cards · 6 topics', icon: 'leaf-outline', tint: palette.greenLight, color: palette.green },
  { id: 'world-history', title: 'World history', detail: '32 cards · 8 topics', icon: 'globe-outline', tint: palette.peach, color: '#A66F43' },
];

export type DeckCard = { question: string; answer: string };

export const deckCardPreviews: Record<string, DeckCard[]> = {
  'visual-arts': [
    { question: 'What does composition mean in visual art?', answer: 'The arrangement of visual elements within an artwork.' },
    { question: 'What is contrast?', answer: 'The difference between visual elements, such as light and dark or large and small.' },
  ],
  'plant-science': [
    { question: 'What process lets plants turn sunlight into energy?', answer: 'Photosynthesis converts light, water, and carbon dioxide into sugars and oxygen.' },
    { question: 'Which part of a plant absorbs most water?', answer: 'The roots absorb water and minerals from the soil.' },
  ],
  'world-history': [
    { question: 'What was the Renaissance?', answer: 'A period of renewed interest in art, science, and classical learning in Europe.' },
    { question: 'Where did the ancient Olympic Games begin?', answer: 'They began in Olympia, in ancient Greece.' },
  ],
};

export type StudyQuiz = {
  id: string;
  title: string;
  description: string;
  questionCount: number;
};

export const quizzes: StudyQuiz[] = [
  { id: 'quiz-arts', title: 'Reading Visual Arts', description: 'Color, composition, and visual language', questionCount: 8 },
  { id: 'quiz-plants', title: 'Plant Science Basics', description: 'A quick review of how plants grow', questionCount: 10 },
  { id: 'quiz-history', title: 'World History', description: 'People and moments that shaped our world', questionCount: 12 },
];

export const week = [
  { day: 'M', done: true },//0
  { day: 'T', done: true },//1
  { day: 'W', done: true },
  { day: 'T', done: true },
  { day: 'F', done: false },
  { day: 'S', done: false },
  { day: 'S', done: false },
];
