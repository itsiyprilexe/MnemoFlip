import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface QuizResult {
  quizId: string;
  quizTitle: string;
  score: number;
  total: number;
  date: string;
}

const QUIZ_KEY = '@flashcards/quizzes';
const RESULT_KEY = '@flashcards/quiz-results';

// Prototype switch: while false, the app starts from the sample data below and
// never reads or writes AsyncStorage. Set to true to bring saving back.
const USE_STORAGE = false;

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: 'q1',
    title: 'Biology Basics',
    description: 'Cells, genetics and ecosystems',
    questions: [
      {
        id: 'q1-1',
        question: 'What is the powerhouse of the cell?',
        options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
        correctIndex: 1,
      },
      {
        id: 'q1-2',
        question: 'Which molecule carries genetic information?',
        options: ['RNA', 'Protein', 'DNA', 'Lipid'],
        correctIndex: 2,
      },
      {
        id: 'q1-3',
        question: 'What process do plants use to make food from sunlight?',
        options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'],
        correctIndex: 1,
      },
      {
        id: 'q1-4',
        question: 'What is the basic unit of life?',
        options: ['Atom', 'Tissue', 'Organ', 'Cell'],
        correctIndex: 3,
      },
    ],
  },
  {
    id: 'q2',
    title: 'Chemistry: Periodic Table',
    description: 'Elements and groups',
    questions: [
      {
        id: 'q2-1',
        question: 'What is the chemical symbol for gold?',
        options: ['Ag', 'Au', 'Gd', 'Go'],
        correctIndex: 1,
      },
      {
        id: 'q2-2',
        question: 'Which element has atomic number 1?',
        options: ['Helium', 'Oxygen', 'Hydrogen', 'Carbon'],
        correctIndex: 2,
      },
      {
        id: 'q2-3',
        question: 'Which group contains the noble gases?',
        options: ['Group 1', 'Group 7', 'Group 17', 'Group 18'],
        correctIndex: 3,
      },
    ],
  },
  {
    id: 'q3',
    title: 'Algebra Review',
    description: 'Equations and functions',
    questions: [
      {
        id: 'q3-1',
        question: 'Solve for x: 2x + 6 = 14',
        options: ['3', '4', '5', '10'],
        correctIndex: 1,
      },
      {
        id: 'q3-2',
        question: 'What is the slope of the line y = 3x + 2?',
        options: ['2', '3', '5', '1/3'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'q4',
    title: 'World History',
    description: 'Major events and dates',
    questions: [
      {
        id: 'q4-1',
        question: 'In what year did World War II end?',
        options: ['1939', '1943', '1945', '1950'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'q5',
    title: 'Environmental Science',
    description: 'Ecosystems and sustainability',
    questions: [], // shows the empty-quiz state
  },
];

const SAMPLE_RESULTS: QuizResult[] = [
  { quizId: 'q1', quizTitle: 'Biology Basics', score: 3, total: 4, date: '9/28/2026' },
  { quizId: 'q2', quizTitle: 'Chemistry: Periodic Table', score: 2, total: 3, date: '9/27/2026' },
];

// Older flashcard-style questions (no options) can't be played, so they are skipped on load.
const sanitize = (list: any[]): Quiz[] =>
  (Array.isArray(list) ? list : []).map((q) => ({
    ...q,
    questions: (q.questions ?? []).filter(
      (x: any) => Array.isArray(x.options) && typeof x.correctIndex === 'number',
    ),
  }));

interface QuizContextType {
  quizzes: Quiz[];
  results: QuizResult[];
  createQuiz: (title: string, description: string) => string;
  deleteQuiz: (quizId: string) => void;
  addQuestion: (quizId: string, question: string, options: string[], correctIndex: number) => void;
  deleteQuestion: (quizId: string, questionId: string) => void;
  saveResult: (quizId: string, score: number) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>(SAMPLE_QUIZZES);
  const [results, setResults] = useState<QuizResult[]>(SAMPLE_RESULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!USE_STORAGE) return; // prototype: keep the sample data
    (async () => {
      try {
        const [q, r] = await Promise.all([AsyncStorage.getItem(QUIZ_KEY), AsyncStorage.getItem(RESULT_KEY)]);
        if (q) setQuizzes(sanitize(JSON.parse(q)));
        if (r) setResults(JSON.parse(r));
      } catch (e) {
        console.warn('Failed to load quizzes', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (USE_STORAGE && loaded) AsyncStorage.setItem(QUIZ_KEY, JSON.stringify(quizzes)).catch((e) => console.warn(e));
  }, [quizzes, loaded]);

  useEffect(() => {
    if (USE_STORAGE && loaded) AsyncStorage.setItem(RESULT_KEY, JSON.stringify(results)).catch((e) => console.warn(e));
  }, [results, loaded]);

  const createQuiz = useCallback((title: string, description: string) => {
    const id = makeId();
    setQuizzes((prev) => [{ id, title, description, questions: [] }, ...prev]);
    return id;
  }, []);

  const deleteQuiz = useCallback((quizId: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    setResults((prev) => prev.filter((r) => r.quizId !== quizId));
  }, []);

  const addQuestion = useCallback((quizId: string, question: string, options: string[], correctIndex: number) => {
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quizId
          ? { ...q, questions: [...q.questions, { id: makeId(), question, options, correctIndex }] }
          : q,
      ),
    );
  }, []);

  const deleteQuestion = useCallback((quizId: string, questionId: string) => {
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quizId ? { ...q, questions: q.questions.filter((x) => x.id !== questionId) } : q,
      ),
    );
  }, []);

  const saveResult = useCallback(
    (quizId: string, score: number) => {
      const quiz = quizzes.find((q) => q.id === quizId);
      if (!quiz) return;
      setResults((prev) => [
        { quizId, quizTitle: quiz.title, score, total: quiz.questions.length, date: new Date().toLocaleDateString() },
        ...prev,
      ]);
    },
    [quizzes],
  );

  const value = useMemo(
    () => ({ quizzes, results, createQuiz, deleteQuiz, addQuestion, deleteQuestion, saveResult }),
    [quizzes, results, createQuiz, deleteQuiz, addQuestion, deleteQuestion, saveResult],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuizzes = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuizzes must be used within QuizProvider');
  return context;
};