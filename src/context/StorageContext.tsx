/**
 * StorageContext
 * Provides full CRUD for Decks and Quizzes, persisted with AsyncStorage.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const DECKS_KEY = '@flashcards/decks';
const QUIZZES_KEY = '@flashcards/quizzes';
const SCORES_KEY = '@flashcards/scores';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

async function load<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function save<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

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
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const StorageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [highScores, setHighScores] = useState<HighScore[]>([]);

  // Load everything on mount
  useEffect(() => {
    Promise.all([
      load<Deck[]>(DECKS_KEY, []),
      load<Quiz[]>(QUIZZES_KEY, []),
      load<HighScore[]>(SCORES_KEY, []),
    ]).then(([d, q, s]) => {
      setDecks(d);
      setQuizzes(q);
      setHighScores(s);
    });
  }, []);

  // ─── Deck CRUD ──────────────────────────────────────────────────────────────

  const createDeck = useCallback(
    (title: string, description: string): string => {
      const id = makeId();
      const next: Deck = { id, title, description, cards: [] };
      setDecks((prev) => {
        const updated = [...prev, next];
        save(DECKS_KEY, updated);
        return updated;
      });
      return id;
    },
    [],
  );

  const renameDeck = useCallback(
    (id: string, title: string, description: string) => {
      setDecks((prev) => {
        const updated = prev.map((d) =>
          d.id === id ? { ...d, title, description } : d,
        );
        save(DECKS_KEY, updated);
        return updated;
      });
    },
    [],
  );

  const deleteDeck = useCallback((id: string) => {
    setDecks((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      save(DECKS_KEY, updated);
      return updated;
    });
  }, []);

  const addCard = useCallback(
    (deckId: string, question: string, answer: string) => {
      setDecks((prev) => {
        const updated = prev.map((d) => {
          if (d.id !== deckId) return d;
          return {
            ...d,
            cards: [...d.cards, { id: makeId(), question, answer }],
          };
        });
        save(DECKS_KEY, updated);
        return updated;
      });
    },
    [],
  );

  const deleteCard = useCallback((deckId: string, cardId: string) => {
    setDecks((prev) => {
      const updated = prev.map((d) => {
        if (d.id !== deckId) return d;
        return { ...d, cards: d.cards.filter((c) => c.id !== cardId) };
      });
      save(DECKS_KEY, updated);
      return updated;
    });
  }, []);

  // ─── Quiz CRUD ──────────────────────────────────────────────────────────────

  const createQuiz = useCallback(
    (title: string, description: string): string => {
      const id = makeId();
      const next: Quiz = { id, title, description, questions: [] };
      setQuizzes((prev) => {
        const updated = [...prev, next];
        save(QUIZZES_KEY, updated);
        return updated;
      });
      return id;
    },
    [],
  );

  const renameQuiz = useCallback(
    (id: string, title: string, description: string) => {
      setQuizzes((prev) => {
        const updated = prev.map((q) =>
          q.id === id ? { ...q, title, description } : q,
        );
        save(QUIZZES_KEY, updated);
        return updated;
      });
    },
    [],
  );

  const deleteQuiz = useCallback((id: string) => {
    setQuizzes((prev) => {
      const updated = prev.filter((q) => q.id !== id);
      save(QUIZZES_KEY, updated);
      return updated;
    });
  }, []);

  const addQuestion = useCallback(
    (
      quizId: string,
      question: string,
      options: string[],
      correctIndex: number,
    ) => {
      setQuizzes((prev) => {
        const updated = prev.map((q) => {
          if (q.id !== quizId) return q;
          return {
            ...q,
            questions: [
              ...q.questions,
              { id: makeId(), question, options, correctIndex },
            ],
          };
        });
        save(QUIZZES_KEY, updated);
        return updated;
      });
    },
    [],
  );

  const deleteQuestion = useCallback((quizId: string, questionId: string) => {
    setQuizzes((prev) => {
      const updated = prev.map((q) => {
        if (q.id !== quizId) return q;
        return {
          ...q,
          questions: q.questions.filter((qs) => qs.id !== questionId),
        };
      });
      save(QUIZZES_KEY, updated);
      return updated;
    });
  }, []);

  // ─── High Scores ────────────────────────────────────────────────────────────

  const saveHighScore = useCallback((score: HighScore) => {
    setHighScores((prev) => {
      const updated = [...prev, score];
      save(SCORES_KEY, updated);
      return updated;
    });
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
