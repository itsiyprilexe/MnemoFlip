import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { listenToItems, type ItemKind } from '../services/itemService';
import type { StudyItem } from '../types/models';
type State = { uid: string | null; items: StudyItem[]; loading: boolean; error: string | null };
export function useItems(kind: ItemKind) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const [state, setState] = useState<State>({ uid: null, items: [], loading: true, error: null });
  useEffect(() => {
    if (!uid) { setState({ uid: null, items: [], loading: false, error: null }); return; }
    let active = true;
    setState({ uid, items: [], loading: true, error: null });
    const unsubscribe = listenToItems(uid, kind,
      items => { if (active) setState({ uid, items, loading: false, error: null }); },
      error => { if (active) setState({ uid, items: [], loading: false, error: error.message }); });
    return () => { active = false; unsubscribe(); };
  }, [uid, kind]);
  return state.uid === uid ? state : { uid, items: [], loading: !!uid, error: null };
}
