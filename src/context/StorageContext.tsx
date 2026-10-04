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
    title: 'Computer Science Fundamentals',
    description: 'Core concepts of data structures, algorithms, and computing.',
    cards: [
      {
        id: 'c-cs-1',
        question: 'What is the key difference between a Stack and a Queue?',
        answer:
          'A Stack operates on Last-In-First-Out (LIFO), whereas a Queue operates on First-In-First-Out (FIFO).',
      },
      {
        id: 'c-cs-2',
        question: 'What is the time complexity of binary search on a sorted array?',
        answer:
          'O(log n), because the search space is divided in half with every comparison.',
      },
      {
        id: 'c-cs-3',
        question: 'What does the ACID acronym represent in databases?',
        answer:
          'Atomicity, Consistency, Isolation, and Durability — guaranteeing reliable database transactions.',
      },
      {
        id: 'c-cs-4',
        question: 'What is the role of an Operating System Kernel?',
        answer:
          'The core software that manages hardware resources (CPU, RAM, devices) and mediates system calls for applications.',
      },
      {
        id: 'c-cs-5',
        question: 'What is the difference between synchronous and asynchronous operations?',
        answer:
          'Synchronous code blocks further execution until complete; asynchronous code executes in the background without blocking.',
      },
      {
        id: 'c-cs-6',
        question: 'What is recursion in computer programming?',
        answer:
          'A programming method where a function calls itself to solve smaller instances of the problem until a base condition is met.',
      },
    ],
  },
  {
    id: 'deck-bio',
    title: 'General Biology & Life Science',
    description: 'Key concepts in cellular biology, genetics, and physiology.',
    cards: [
      {
        id: 'c-bio-1',
        question: 'Which organelle is considered the powerhouse of the cell?',
        answer:
          'Mitochondria — produces ATP (adenosine triphosphate) through cellular respiration.',
      },
      {
        id: 'c-bio-2',
        question: 'What is the fundamental chemical reaction of photosynthesis?',
        answer:
          '6CO₂ + 6H₂O + solar energy → C₆H₁₂O₆ (glucose) + 6O₂.',
      },
      {
        id: 'c-bio-3',
        question: 'Which four nitrogenous bases make up DNA?',
        answer:
          'Adenine (A), Thymine (T), Guanine (G), and Cytosine (C).',
      },
      {
        id: 'c-bio-4',
        question: 'What is the primary function of Red Blood Cells (erythrocytes)?',
        answer:
          'Carrying oxygen from the lungs to body tissues using the iron-containing protein hemoglobin.',
      },
      {
        id: 'c-bio-5',
        question: 'What is osmosis?',
        answer:
          'The passive net movement of water molecules across a semipermeable membrane from low to high solute concentration.',
      },
    ],
  },
  {
    id: 'deck-hist',
    title: 'World History & Civilizations',
    description: 'Milestones, cultural eras, and major global events.',
    cards: [
      {
        id: 'c-hist-1',
        question: 'In what year did World War II officially end?',
        answer:
          '1945, marked by the unconditional surrender of the Axis powers.',
      },
      {
        id: 'c-hist-2',
        question: 'Which ancient civilization built the Great Pyramids of Giza?',
        answer:
          'Ancient Egypt during the Old Kingdom period (~2500 BCE).',
      },
      {
        id: 'c-hist-3',
        question: 'What was the Renaissance and where did it originate?',
        answer:
          'A cultural revival of art, literature, and science originating in 14th-century Florence, Italy.',
      },
      {
        id: 'c-hist-4',
        question: 'What historic English charter was signed in 1215 to limit royal authority?',
        answer:
          'The Magna Carta (Great Charter) granted by King John of England.',
      },
      {
        id: 'c-hist-5',
        question: 'Who introduced the movable-type printing press to Europe?',
        answer:
          'Johannes Gutenberg in Mainz, Germany, circa 1440.',
      },
    ],
  },
  {
    id: 'deck-span',
    title: 'Spanish Language Essentials',
    description: 'Essential vocabulary, greetings, and common expressions.',
    cards: [
      {
        id: 'c-span-1',
        question: 'How do you say "Good morning" and "Good night" in Spanish?',
        answer:
          '"Buenos días" (Good morning) and "Buenas noches" (Good night / evening).',
      },
      {
        id: 'c-span-2',
        question: 'What is the distinction between verbs "ser" and "estar"?',
        answer:
          '"Ser" is used for permanent traits and identity; "estar" is used for temporary conditions and locations.',
      },
      {
        id: 'c-span-3',
        question: 'How do you ask "Where is the library?" in Spanish?',
        answer:
          '"¿Dónde está la biblioteca?"',
      },
      {
        id: 'c-span-4',
        question: 'What do "Por favor" and "Muchas gracias" mean?',
        answer:
          '"Please" and "Thank you very much".',
      },
      {
        id: 'c-span-5',
        question: 'Translate: "Tengo que estudiar para el examen de mañana."',
        answer:
          '"I have to study for tomorrow\'s exam."',
      },
    ],
  },
  {
    id: 'deck-art',
    title: 'Visual Art & Design Principles',
    description: 'Elements of composition, color harmony, and visual aesthetics.',
    cards: [
      {
        id: 'c-art-1',
        question: 'What are the primary colors in pigment (subtractive) color theory?',
        answer:
          'Red, Yellow, and Blue (or Cyan, Magenta, Yellow in modern printing).',
      },
      {
        id: 'c-art-2',
        question: 'What distinguishes serif from sans-serif fonts?',
        answer:
          'Serif fonts have small decorative strokes ("feet") at the ends of letterforms; sans-serif fonts are clean and stroke-less.',
      },
      {
        id: 'c-art-3',
        question: 'What is the Rule of Thirds in composition?',
        answer:
          'Dividing an image with 2 horizontal and 2 vertical lines to position focal points along lines or intersections.',
      },
      {
        id: 'c-art-4',
        question: 'What does the term "chiaroscuro" describe in art?',
        answer:
          'The deliberate contrast between strong light and deep shadow to give subjects volume and dramatic depth.',
      },
    ],
  },
];

export const STATIC_QUIZZES: Quiz[] = [
  {
    id: 'quiz-cs',
    title: 'Computer Science Quick Check',
    description: 'Test your understanding of basic algorithms, data structures, and computing.',
    questions: [
      {
        id: 'q-cs-1',
        question: 'What is the average time complexity of accessing an array element by index?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctIndex: 0,
      },
      {
        id: 'q-cs-2',
        question: 'Which data structure follows a First-In-First-Out (FIFO) pattern?',
        options: ['Stack', 'Queue', 'Binary Search Tree', 'Max-Heap'],
        correctIndex: 1,
      },
      {
        id: 'q-cs-3',
        question: 'What does HTTP stand for in networking?',
        options: [
          'HyperText Transfer Protocol',
          'High Tech Terminal Process',
          'Host Transfer Protocol',
          'Hybrid Text Transport Packet',
        ],
        correctIndex: 0,
      },
      {
        id: 'q-cs-4',
        question: 'Which type of computer memory retains data even when power is turned off?',
        options: ['RAM', 'L2 Cache', 'SSD / ROM', 'CPU Registers'],
        correctIndex: 2,
      },
      {
        id: 'q-cs-5',
        question: 'In OOP, combining data attributes and operating methods within a single class is called:',
        options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'quiz-sci',
    title: 'General Science Challenge',
    description: 'Multiple-choice questions spanning life science, chemistry, and physics.',
    questions: [
      {
        id: 'q-sci-1',
        question: 'Which cell organelle generates ATP energy through cellular respiration?',
        options: ['Ribosome', 'Mitochondria', 'Golgi Body', 'Endoplasmic Reticulum'],
        correctIndex: 1,
      },
      {
        id: 'q-sci-2',
        question: 'What is the chemical formula for pure water?',
        options: ['CO₂', 'NaCl', 'H₂O', 'CH₄'],
        correctIndex: 2,
      },
      {
        id: 'q-sci-3',
        question: 'Which planet in our solar system orbits closest to the Sun?',
        options: ['Venus', 'Mars', 'Mercury', 'Earth'],
        correctIndex: 2,
      },
      {
        id: 'q-sci-4',
        question: 'What fundamental force draws objects toward the center of the Earth?',
        options: ['Centrifugal force', 'Gravity', 'Magnetic pull', 'Static friction'],
        correctIndex: 1,
      },
      {
        id: 'q-sci-5',
        question: 'Which gas do green plants absorb from the air during photosynthesis?',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Methane'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'quiz-hist',
    title: 'World History Quiz',
    description: 'Explore key historical eras, ancient civilizations, and major milestones.',
    questions: [
      {
        id: 'q-hist-1',
        question: 'In which year did World War II conclude?',
        options: ['1939', '1941', '1945', '1950'],
        correctIndex: 2,
      },
      {
        id: 'q-hist-2',
        question: 'Which pre-Columbian civilization constructed the citadel of Machu Picchu?',
        options: ['Aztec', 'Maya', 'Inca', 'Olmec'],
        correctIndex: 2,
      },
      {
        id: 'q-hist-3',
        question: 'Who was the first President of the United States under the Constitution?',
        options: ['Thomas Jefferson', 'George Washington', 'John Adams', 'Alexander Hamilton'],
        correctIndex: 1,
      },
      {
        id: 'q-hist-4',
        question: 'In which European country did the Renaissance movement first begin?',
        options: ['France', 'England', 'Italy', 'Germany'],
        correctIndex: 2,
      },
      {
        id: 'q-hist-5',
        question: 'Which ancient Roman military commander was declared dictator perpetuo in 44 BCE?',
        options: ['Julius Caesar', 'Alexander the Great', 'Hannibal', 'Augustus'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'quiz-span',
    title: 'Basic Spanish Vocabulary',
    description: 'Review common vocabulary words, greetings, and expressions.',
    questions: [
      {
        id: 'q-span-1',
        question: 'What does the Spanish word "Gracias" mean?',
        options: ['Please', 'Thank you', "You're welcome", 'Goodbye'],
        correctIndex: 1,
      },
      {
        id: 'q-span-2',
        question: 'How do you greet someone with "Good morning" in Spanish?',
        options: ['Buenas tardes', 'Buenas noches', 'Buenos días', 'Hasta pronto'],
        correctIndex: 2,
      },
      {
        id: 'q-span-3',
        question: 'What does the Spanish word "libro" translate to in English?',
        options: ['Letter', 'Book', 'Pen', 'Library'],
        correctIndex: 1,
      },
      {
        id: 'q-span-4',
        question: 'Which color is represented by "azul"?',
        options: ['Red', 'Green', 'Yellow', 'Blue'],
        correctIndex: 3,
      },
      {
        id: 'q-span-5',
        question: 'What is the Spanish term for "water"?',
        options: ['Agua', 'Fuego', 'Tierra', 'Viento'],
        correctIndex: 0,
      },
    ],
  },
];

export const STATIC_HIGH_SCORES: HighScore[] = [
  {
    deckId: 'quiz-cs',
    deckTitle: 'Computer Science Quick Check',
    score: 5,
    totalQuestions: 5,
    date: 'Yesterday',
  },
  {
    deckId: 'quiz-sci',
    deckTitle: 'General Science Challenge',
    score: 4,
    totalQuestions: 5,
    date: '3 days ago',
  },
  {
    deckId: 'quiz-hist',
    deckTitle: 'World History Quiz',
    score: 5,
    totalQuestions: 5,
    date: 'Oct 2, 2026',
  },
  {
    deckId: 'quiz-span',
    deckTitle: 'Basic Spanish Vocabulary',
    score: 4,
    totalQuestions: 5,
    date: 'Oct 1, 2026',
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
