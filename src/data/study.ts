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
<<<<<<< HEAD
  { id: 'Reading-visual-arts', 
    title: 'Reading Visual Arts', 
    detail: '2 cards · 1 topic', 
    icon: 'color-palette-outline', 
    tint: palette.lilac, 
    color: '#786798' },

  { id: 'Mobile-programming', 
    title: 'Mobile Programming', 
    detail: '2 cards · 1 topic', 
    icon: 'leaf-outline', 
    tint: palette.greenLight, 
    color: palette.green },

  { id: 'Software-engineering', 
    title: 'Software Engineering', 
    detail: '2 cards · 1 topic', 
    icon: 'globe-outline', 
    tint: palette.peach, 
    color: '#A66F43' },
=======
  { id: 'visual-arts', title: 'Visual arts', detail: '18 cards · 4 topics', icon: 'color-palette-outline', tint: palette.lilac, color: '#786798' },
  { id: 'plant-science', title: 'Plant science', detail: '24 cards · 6 topics', icon: 'leaf-outline', tint: palette.greenLight, color: palette.green },
  { id: 'world-history', title: 'World history', detail: '32 cards · 8 topics', icon: 'globe-outline', tint: palette.peach, color: '#A66F43' },
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
];

export type DeckCard = { question: string; answer: string };

export const deckCardPreviews: Record<string, DeckCard[]> = {
<<<<<<< HEAD
  'Reading-visual-arts': [
    { question: 'What is reading visual arts?', 
      answer: 'It is the process of understanding and interpreting the meaning of an artwork.' },

    { question: 'Why is reading visual arts important?', 
      answer: 'It helps us understand the artist’s ideas, emotions, and message through colors, shapes, symbols, and other visual elements.' },
  ],
  'Mobile-programming': [
    { question: 'What is Mobile Programming?', 
      answer: 'Mobile programming is the process of creating applications for smartphones and tablets.' },

    { question: 'Why is Mobile Programming important?', 
      answer: 'It allows developers to create useful apps that people can access anytime using mobile devices.' },
  ],
  'Software-engineering': [
    { question: 'What is software engineering?', 
      answer: 'Software engineering is the process of designing, developing, testing, and maintaining software.' },

    { question: 'Why is software engineering important?', 
      answer: 'It helps developers create reliable, efficient, and easy-to-maintain software.' },
=======
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
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
  ],
};

export type StudyQuiz = {
  id: string;
  title: string;
  description: string;
  questionCount: number;
};

export const quizzes: StudyQuiz[] = [
<<<<<<< HEAD
  { id: 'quiz-arts', 
    title: 'Reading Visual Arts', 
    description: 'Color, composition, and visual language', 
    questionCount: 50 },

  { id: 'quiz-programming', 
    title: 'Mobile Programming', 
    description: 'Designing and developing applications for mobile devices', 
    
    questionCount: 10 },
  { id: 'quiz-engineering', 
    title: 'Software Engineering', 
    description: 'Designing, developing, testing, and maintaining software', 
    questionCount: 30 },
];

export const week = [
  { day: 'M', done: true },
  { day: 'T', done: true },
=======
  { id: 'quiz-arts', title: 'Reading Visual Arts', description: 'Color, composition, and visual language', questionCount: 8 },
  { id: 'quiz-plants', title: 'Plant Science Basics', description: 'A quick review of how plants grow', questionCount: 10 },
  { id: 'quiz-history', title: 'World History', description: 'People and moments that shaped our world', questionCount: 12 },
];

export const week = [
  { day: 'M', done: true },//0
  { day: 'T', done: true },//1
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
  { day: 'W', done: true },
  { day: 'T', done: true },
  { day: 'F', done: false },
  { day: 'S', done: false },
  { day: 'S', done: false },
];
