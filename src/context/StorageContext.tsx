/**
 * StorageContext
 * Provides static, pre-populated flashcard decks, quizzes, and high scores.
 * Replaces dynamic AsyncStorage database CRUD with static mock data.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

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

export interface HighScore {
  deckId: string;
  deckTitle: string;
  score: number;
  totalQuestions: number;
  date: string;
}

// ─── Static Mock Data of Decks and Quizzes ───────────────────────────────────────────────────────

export const STATIC_DECKS: Deck[] = [
  {
    id: 'deck-cs',
    title: 'Mobile Programming',
    description: 'The process of writing software specifically designed to run on handheld devices such as smartphones, tablets, and smartwatches.',
    cards: [
      {
        id: 'c-cs-1',
        question: 'Which programming language is designated by Google as the preferred language for native Android development?',
        answer:
          'Kotlin.',
      },
      {
        id: 'c-cs-2',
        question: 'Which programming language is primarily used for native iOS development?',
        answer:
          'Swift.',
      },
      {
        id: 'c-cs-3',
        question: 'What primary advantage does cross-platform mobile development offer over native development?Si',
        answer:
          'Single Codebase Deployment',
      },
    ],
  },
  {
    id: 'deck-bio',
    title: 'Automata Theory',
    description: 'Branch of theoretical computer science and mathematics that studies abstract machines (automata) and the computational problems that can be solved using them.',
    cards: [
      {
        id: 'c-bio-1',
        question: 'Which type of language is formally recognized by a Deterministic Finite Automaton (DFA)?',
        answer:
          'Regular Language',
      },
      {
        id: 'c-bio-2',
        question: 'What structural component distinguishes a Pushdown Automaton (PDA) from a Finite State Automaton (FSA)?',
        answer:
          'Stack Memory',
      },
      {
        id: 'c-bio-3',
        question: 'In a formal transition function for a Deterministic Finite Automaton $\delta: Q \times \Sigma \rightarrow Q$, what does $Q$ represent?',
        answer:
          'Set of States',
      },
    ],
  },
  {
    id: 'deck-hist',
    title: 'Software Engineering',
    description: 'Systematic, disciplined application of engineering principles to the design, development, maintenance, testing, and evaluation of software systems.',
    cards: [
      {
        id: 'c-hist-1',
        question: 'Which software development methodology emphasizes short, iterative development cycles called sprints and frequent reassessment of plans?',
        answer:
          'Agile',
      },
      {
        id: 'c-hist-2',
        question: 'What is the main purpose of using a version control system like Git in software engineering?',
        answer:
          'Tracking changes to code over time and collaborating,',
      },
      {
        id: 'c-hist-3',
        question: 'Which type of software testing focuses on verifying that individual isolated units or functions work as expected?',
        answer:
          'Unit Testing',
      },
    ],
  },
  {
    id: 'deck-span',
    title: 'Reading Visual Arts',
    description: 'The discipline and critical practice of analyzing, interpreting, and evaluating visual images and artifacts.',
    cards: [
      {
        id: 'c-span-1',
        question: 'Which visual element refers to the path left by a moving point, such as a pencil, brush, or pen mark?',
        answer:
          'Line',
      },
      {
        id: 'c-span-2',
        question: 'Which set consists entirely of primary colors in traditional color theory?',
        answer:
          'Red, Blue, and Yellow',
      },
      {
        id: 'c-span-3',
        question: 'What composition technique divides an image into a nine-part grid to create balance and interest?',
        answer:
          'Rule of Thirds',
      },
    ],
  },
  {
    id: 'deck-art',
    title: 'Programming Languages',
    description: 'Overview of popular programming languages and their characteristics.',
    cards: [
      {
        id: 'c-art-1',
        question: 'Which programming language is primarily used for structure and presentation when creating web pages?',
        answer:
          'HTML',
      },
      {
        id: 'c-art-2',
        question: 'What is the primary role of a compiler in software development?',
        answer:
          'To translate source code written in a high-level programming language into machine code that can be executed by a computer.',
      },
      {
        id: 'c-art-3',
        question: 'Which programming language is natively used for developing modern Android applications?',
        answer:
          'Kotlin',
      },
    ],
  },
];

export const STATIC_QUIZZES: Quiz[] = [
  {
    id: 'quiz-pl',
    title: 'Pogramming Languages',
    description: 'Give it a shot and test your computer science knowledge!',
    questions: [
      {
        id: 'q-pl-1',
        question: 'Which programming paradigm treats computation primarily as the evaluation of mathematical functions while strictly avoiding state modification and mutable data?',
        options: ['Functional Programming', 'Object-Oriented Programming', 'Procedural Programming', 'Imperative Programming'],
        correctIndex: 0,
      },
      {
        id: 'q-pl-2',
        question: 'Which parameter passing mechanism passes a reference to a variable that evaluates the argument each time it is accessed inside the function?',
        options: ['Call by name', 'Call by reference', 'Call by value', 'Call by result'],
        correctIndex: 0,
      },
      {
        id: 'q-pl-3',
        question: 'What structural feature in a grammar causes ambiguous parsing for nested if-then-else constructs?',
        options: [
          'Left Recursion',
          'Shift-reduce conflict',
          'Danglin else',
          'Operator precedence',
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'quiz-rva',
    title: 'Reading Visual Arts',
    description: 'Give it a shot and test your computer science knowledge!',
    questions: [
      {
        id: 'q-rva-1',
        question: 'Which principle of design refers to the visual weight distribution that stabilizes an artwork?',
        options: ['Proportion', 'Rhythm', 'Balance', 'Contrast'],
        correctIndex: 2,
      },
      {
        id: 'q-rva-2',
        question: 'In formal art analysis, what does the term chiaroscuro describe?',
        options: ['Linear Perspective', 'Surface Texture', 'Color Harmony', 'Light-dark Contrast'],
        correctIndex: 3,
      },
      {
        id: 'q-rva-3',
        question: 'What level of art analysis focuses strictly on identifying symbols, themes, and subject matter?',
        options: ['Medium Analysis', 'Iconagraphic Analysis', 'Contextual Analysis', 'Formal Analysis'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'quiz-mp',
    title: 'Mobile Programming',
    description: 'Give it a shot and test your computer science knowledge!',
    questions: [
      {
        id: 'q-mp-1',
        question: 'Which architecture pattern relies on two-way data binding to automatically synchronize the view and data model in mobile applications?',
        options: ['MVVM', 'MVC', 'MVI', 'MVP'],
        correctIndex: 0,
      },
      {
        id: 'q-mp-2',
        question: 'In Android app lifecycles, which callback is invoked immediately before an Activity becomes visible to the user?',
        options: ['onStart', 'onResume', 'onPause', 'onStop'],
        correctIndex: 1,
      },
      {
        id: 'q-mp-3',
        question: 'Which cross-platform framework uses direct compilation to native code via AOT (Ahead-Of-Time) instead of a JS bridge at runtime?',
        options: ['React Native', 'Flutter', 'Apache Cordova', 'Ionic Framework'],
        correctIndex: 2,
      },
    ],
  },
];

export const STATIC_HIGH_SCORES: HighScore[] = [
  {
    deckId: 'quiz-rva',
    deckTitle: 'Reading Visual Arts',
    score: 3,
    totalQuestions: 3,
    date: 'Yesterday',
  },
  {
    deckId: 'quiz-pl',
    deckTitle: 'Programming Logic',
    score: 4,
    totalQuestions: 3,
    date: '3 days ago',
  },
  {
    deckId: 'quiz-mp',
    deckTitle: 'Mobile Programming',
    score: 2,
    totalQuestions: 3,
    date: 'Oct 2, 2026',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

// ─── Context Shape ────────────────────────────────────────────────────────────

interface StorageContextType {
  // Decks
  decks: Deck[];
  createDeck: (title: string, description: string) => string;
  renameDeck: (id: string, title: string, description: string) => void;
  deleteDeck: (id: string) => void;
  addCard: (deckId: string, question: string, answer: string) => void;
  deleteCard: (deckId: string, cardId: string) => void;

  // Quizzes
  quizzes: Quiz[];
  createQuiz: (title: string, description: string) => string;
  renameQuiz: (id: string, title: string, description: string) => void;
  deleteQuiz: (id: string) => void;
  addQuestion: (
    quizId: string,
    question: string,
    options: string[],
    correctIndex: number,
  ) => void;
  deleteQuestion: (quizId: string, questionId: string) => void;

  // High Scores
  highScores: HighScore[];
  saveHighScore: (score: HighScore) => void;

  // Reset to static defaults
  resetToStaticDefaults: () => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const StorageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialized directly with rich static mock data (no AsyncStorage needed)
  const [decks, setDecks] = useState<Deck[]>(STATIC_DECKS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(STATIC_QUIZZES);
  const [highScores, setHighScores] = useState<HighScore[]>(STATIC_HIGH_SCORES);

  // ─── Reset Helper ───────────────────────────────────────────────────────────
  const resetToStaticDefaults = useCallback(() => {
    setDecks(STATIC_DECKS);
    setQuizzes(STATIC_QUIZZES);
    setHighScores(STATIC_HIGH_SCORES);
  }, []);

  // ─── Deck In-Memory Operations ──────────────────────────────────────────────

  const createDeck = useCallback(
    (title: string, description: string): string => {
      const id = makeId();
      const next: Deck = { id, title, description, cards: [] };
      setDecks((prev) => [...prev, next]);
      return id;
    },
    [],
  );

  const renameDeck = useCallback(
    (id: string, title: string, description: string) => {
      setDecks((prev) =>
        prev.map((d) => (d.id === id ? { ...d, title, description } : d)),
      );
    },
    [],
  );

  const deleteDeck = useCallback((id: string) => {
    setDecks((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const addCard = useCallback(
    (deckId: string, question: string, answer: string) => {
      setDecks((prev) =>
        prev.map((d) => {
          if (d.id !== deckId) return d;
          return {
            ...d,
            cards: [...d.cards, { id: makeId(), question, answer }],
          };
        }),
      );
    },
    [],
  );

  const deleteCard = useCallback((deckId: string, cardId: string) => {
    setDecks((prev) =>
      prev.map((d) => {
        if (d.id !== deckId) return d;
        return { ...d, cards: d.cards.filter((c) => c.id !== cardId) };
      }),
    );
  }, []);

  // ─── Quiz In-Memory Operations ──────────────────────────────────────────────

  const createQuiz = useCallback(
    (title: string, description: string): string => {
      const id = makeId();
      const next: Quiz = { id, title, description, questions: [] };
      setQuizzes((prev) => [...prev, next]);
      return id;
    },
    [],
  );

  const renameQuiz = useCallback(
    (id: string, title: string, description: string) => {
      setQuizzes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, title, description } : q)),
      );
    },
    [],
  );

  const deleteQuiz = useCallback((id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const addQuestion = useCallback(
    (
      quizId: string,
      question: string,
      options: string[],
      correctIndex: number,
    ) => {
      setQuizzes((prev) =>
        prev.map((q) => {
          if (q.id !== quizId) return q;
          return {
            ...q,
            questions: [
              ...q.questions,
              { id: makeId(), question, options, correctIndex },
            ],
          };
        }),
      );
    },
    [],
  );

  const deleteQuestion = useCallback((quizId: string, questionId: string) => {
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id !== quizId) return q;
        return {
          ...q,
          questions: q.questions.filter((qs) => qs.id !== questionId),
        };
      }),
    );
  }, []);

  // ─── High Scores In-Memory Operations ───────────────────────────────────────

  const saveHighScore = useCallback((score: HighScore) => {
    setHighScores((prev) => [score, ...prev]);
  }, []);

  // ─── Context Value ───────────────────────────────────────────────────────────

  const value = useMemo(
    () => ({
      decks,
      createDeck,
      renameDeck,
      deleteDeck,
      addCard,
      deleteCard,
      quizzes,
      createQuiz,
      renameQuiz,
      deleteQuiz,
      addQuestion,
      deleteQuestion,
      highScores,
      saveHighScore,
      resetToStaticDefaults,
    }),
    [
      decks,
      createDeck,
      renameDeck,
      deleteDeck,
      addCard,
      deleteCard,
      quizzes,
      createQuiz,
      renameQuiz,
      deleteQuiz,
      addQuestion,
      deleteQuestion,
      highScores,
      saveHighScore,
      resetToStaticDefaults,
    ],
  );

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useStorage = () => {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorage must be used within StorageProvider');
  return ctx;
};
