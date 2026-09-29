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

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

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
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
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
    if (loaded) AsyncStorage.setItem(QUIZ_KEY, JSON.stringify(quizzes)).catch((e) => console.warn(e));
  }, [quizzes, loaded]);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(RESULT_KEY, JSON.stringify(results)).catch((e) => console.warn(e));
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