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
  { id: 'Reading-visual-arts', 
    title: 'Reading Visual Arts', 
    detail: '18 cards · 4 topics', 
    icon: 'color-palette-outline', 
    tint: palette.lilac, 
    color: '#786798' 
  },

  { id: 'Mobile-programming', 
    title: 'Mobile Programming',
    detail: '24 cards · 6 topics', 
    icon: 'leaf-outline', 
    tint: palette.greenLight, 
    color: palette.green 
  },
  { id: 'Software-engineering', 
    title: 'Software Engineering', 
    detail: '32 cards · 8 topics', 
    icon: 'globe-outline', 
    tint: palette.peach, 
    color: '#A66F43' 
  },
];

export type DeckCard = { question: string; answer: string };

export const deckCardPreviews: Record<string, DeckCard[]> = {
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
  ],
};

export type StudyQuiz = {
  id: string;
  title: string;
  description: string;
  questionCount: number;
};

export const quizzes: StudyQuiz[] = [
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
  { day: 'W', done: true },
  { day: 'T', done: true },
  { day: 'F', done: false },
  { day: 'S', done: false },
  { day: 'S', done: false },
];
