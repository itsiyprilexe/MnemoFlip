import { useItems } from './useItems';
export function useDecks() { const { items, ...state } = useItems('deck'); return { decks: items, ...state }; }
