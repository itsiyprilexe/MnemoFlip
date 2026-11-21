import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { listenToItems, type ItemKind } from '../services/itemService';
import type { StudyItem } from '../types/models';

type ItemsState = {
  uid: string | null;
  items: StudyItem[];
  loading: boolean;
  error: string | null;
};

export function useItems(kind: ItemKind) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const [state, setState] = useState<ItemsState>({
    uid: null,
    items: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!uid) {
      setState({ uid: null, items: [], loading: false, error: null });
      return;
    }

    let active = true;
    setState({ uid, items: [], loading: true, error: null });

    // Listen only to the current user's data.
    const unsubscribe = listenToItems(
      uid,
      kind,
      items => {
        if (active) setState({ uid, items, loading: false, error: null });
      },
      error => {
        if (active) setState({ uid, items: [], loading: false, error: error.message });
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [uid, kind]);

  // Never display an earlier account's list while the new list is loading.
  if (state.uid !== uid) {
    return { uid, items: [], loading: !!uid, error: null };
  }

  return state;
}
