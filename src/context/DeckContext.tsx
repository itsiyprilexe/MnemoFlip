import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Deck, HighScore } from '../types';

const DECKS_KEY = '@flashcards/decks';
const SCORES_KEY = '@flashcards/highScores';
const MAX_SCORES = 50;

const INITIAL_DECKS: Deck[] = [
  {
    id: '1',
    title: 'React Native Basics',
    description: 'Core concepts, hooks, and mobile layout',
    cards: [
      { id: '101', question: 'What component is used for flex box layouts?', answer: 'View' },
      { id: '102', question: 'How do you accept user text input?', answer: 'TextInput' },
    ],
  },
  {
    id: '2',
    title: 'TypeScript Fundamentals',
    description: 'Types, interfaces, and generics',
    cards: [
      { id: '201', question: 'What keyword defines an object structure?', answer: 'interface or type' },
    ],
  },
];

const INITIAL_HIGH_SCORES: HighScore[] = [
  { deckId: '1', deckTitle: 'React Native Basics', score: 2, totalQuestions: 2, date: '2026-09-28' },
];

// Collision-safe IDs (Date.now() alone can repeat within the same millisecond)
const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

interface DeckContextType {
  decks: Deck[];
  highScores: HighScore[];
  isLoading: boolean;
  getDeck: (deckId: string) => Deck | undefined;
  createDeck: (title: string, description: string) => string | null;
  updateDeck: (deckId: string, updates: { title?: string; description?: string }) => void;
  deleteDeck: (deckId: string) => void;
  addCard: (deckId: string, question: string, answer: string) => void;
  updateCard: (deckId: string, cardId: string, question: string, answer: string) => void;
  deleteCard: (deckId: string, cardId: string) => void;
  saveHighScore: (deckId: string, deckTitle: string, score: number, total: number) => void;
  clearHighScores: () => void;
}

const DeckContext = createContext<DeckContextType | undefined>(undefined);

export const DeckProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [decks, setDecks] = useState<Deck[]>(INITIAL_DECKS);
  const [highScores, setHighScores] = useState<HighScore[]>(INITIAL_HIGH_SCORES);
  const [isLoading, setIsLoading] = useState(true);
  const hydrated = useRef(false);

  // Load saved data on startup
  useEffect(() => {
    (async () => {
      try {
        const [savedDecks, savedScores] = await Promise.all([
          AsyncStorage.getItem(DECKS_KEY),
          AsyncStorage.getItem(SCORES_KEY),
        ]);
        if (savedDecks) setDecks(JSON.parse(savedDecks));
        if (savedScores) setHighScores(JSON.parse(savedScores));
      } catch (e) {
        console.warn('Failed to load saved data', e);
      } finally {
        hydrated.current = true;
        setIsLoading(false);
      }
    })();
  }, []);

  // Persist on change (only after initial load so we don't overwrite saved data)
  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(DECKS_KEY, JSON.stringify(decks)).catch(() => {});
  }, [decks]);

  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(SCORES_KEY, JSON.stringify(highScores)).catch(() => {});
  }, [highScores]);

  const getDeck = useCallback((deckId: string) => decks.find((d) => d.id === deckId), [decks]);

  const createDeck = useCallback((title: string, description: string) => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return null;
    const id = makeId();
    setDecks((prev) => [...prev, { id, title: cleanTitle, description: description.trim(), cards: [] }]);
    return id;
  }, []);

  const updateDeck = useCallback(
    (deckId: string, updates: { title?: string; description?: string }) => {
      setDecks((prev) =>
        prev.map((d) =>
          d.id === deckId
            ? {
                ...d,
                title: updates.title?.trim() || d.title,
                description: updates.description?.trim() ?? d.description,
              }
            : d
        )
      );
    },
    []
  );

  const deleteDeck = useCallback((deckId: string) => {
    setDecks((prev) => prev.filter((d) => d.id !== deckId));
    setHighScores((prev) => prev.filter((s) => s.deckId !== deckId));
  }, []);

  const addCard = useCallback((deckId: string, question: string, answer: string) => {
    const q = question.trim();
    const a = answer.trim();
    if (!q || !a) return;
    setDecks((prev) =>
      prev.map((deck) =>
        deck.id === deckId
          ? { ...deck, cards: [...deck.cards, { id: makeId(), question: q, answer: a }] }
          : deck
      )
    );
  }, []);

  const updateCard = useCallback(
    (deckId: string, cardId: string, question: string, answer: string) => {
      const q = question.trim();
      const a = answer.trim();
      if (!q || !a) return;
      setDecks((prev) =>
        prev.map((deck) =>
          deck.id === deckId
            ? {
                ...deck,
                cards: deck.cards.map((c) => (c.id === cardId ? { ...c, question: q, answer: a } : c)),
              }
            : deck
        )
      );
    },
    []
  );

  const deleteCard = useCallback((deckId: string, cardId: string) => {
    setDecks((prev) =>
      prev.map((deck) =>
        deck.id === deckId ? { ...deck, cards: deck.cards.filter((c) => c.id !== cardId) } : deck
      )
    );
  }, []);

  const saveHighScore = useCallback(
    (deckId: string, deckTitle: string, score: number, total: number) => {
      const newScore: HighScore = {
        deckId,
        deckTitle,
        score,
        totalQuestions: total,
        date: new Date().toISOString().split('T')[0],
      };
      setHighScores((prev) => [newScore, ...prev].slice(0, MAX_SCORES));
    },
    []
  );

  const clearHighScores = useCallback(() => setHighScores([]), []);

  const value = useMemo(
    () => ({
      decks,
      highScores,
      isLoading,
      getDeck,
      createDeck,
      updateDeck,
      deleteDeck,
      addCard,
      updateCard,
      deleteCard,
      saveHighScore,
      clearHighScores,
    }),
    [
      decks,
      highScores,
      isLoading,
      getDeck,
      createDeck,
      updateDeck,
      deleteDeck,
      addCard,
      updateCard,
      deleteCard,
      saveHighScore,
      clearHighScores,
    ]
  );

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
};

export const useDecks = () => {
  const context = useContext(DeckContext);
  if (!context) throw new Error('useDecks must be used within DeckProvider');
  return context;
};