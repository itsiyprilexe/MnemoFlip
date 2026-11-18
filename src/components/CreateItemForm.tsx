import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { getItem, saveItem } from '../services/itemService';
import { AppButton } from './AppButton';
import { FormScreenHeader } from './FormScreenHeader';
import { TextField } from './TextField';
import { palette } from '../theme';

type Props = { kind: 'deck' | 'quiz' };// ig set an value depende sa user kun galing siya sa deck or quiz

export function CreateItemForm({ kind }: Props) {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [loading, setLoading] = useState(!!id);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maximum, setMaximum] = useState('20');
  const itemName = kind === 'deck' ? 'deck' : 'quiz';
  useEffect(() => {
    if (!id || !user) return;
    let active = true;
    setLoading(true); setLoadError(null);
    getItem(user.uid, kind, id).then(item => { if (!active) return; if (!item) { setLoadError('This item was not found.'); return; } setTitle(item.title); setDescription(item.description); setMaximum(String(item.maxItems)); }).catch(() => { if (active) setLoadError('Could not load this item.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, kind, user?.uid]);
  const titleLabel = kind === 'deck' ? 'Deck name' : 'Quiz name';
  const titlePlaceholder = kind === 'deck' ? 'e.g. Human anatomy' : 'e.g. Cell biology basics';
  const buttonLabel = id ? 'Save changes' : kind === 'deck' ? 'Add deck' : 'Add quiz';

  const save = async () => {
    if (saving || loading || loadError) return;
    if (!user) { Alert.alert('Sign in required'); return; }
    setSaving(true);
    try {
      const savedId = await saveItem(user.uid, kind, title, description, Number(maximum), id);
      if (id) router.replace(kind === 'deck' ? '/decks' : '/quiz');
      else if (kind === 'deck') router.replace({ pathname: '/(tabs)/decks/deck/[id]', params: { id: savedId, add: 'true' } });
      else router.replace({ pathname: '/(tabs)/quiz/[id]', params: { id: savedId } });
    }
    catch (error) { Alert.alert(`Could not save ${kind}`, error instanceof Error ? error.message : 'Please try again.'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <FormScreenHeader fallbackHref={kind === 'deck' ? '/decks' : '/quiz'} />
      <Text style={styles.eyebrow}>YOUR LIBRARY</Text>
      <Text style={styles.title}>{id ? `Edit ${kind}` : `Add a ${kind}`}</Text>

      <Text style={styles.description}>
        Enter a title and description.
      </Text>

      {loading ? <Text>Loading...</Text> : loadError ? <Text>{loadError}</Text> : null}
      <TextField
        label={titleLabel}
        value={title}
        onChangeText={setTitle}
        placeholder={titlePlaceholder}
        autoCapitalize="words"
        maxLength={60}
        returnKeyType="next"
      />
      <TextField
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder={`What will this ${itemName} cover?`}
        multiline
        maxLength={180}
      />

      <TextField label={kind === 'deck' ? 'Maximum flashcards (1–100)' : 'Maximum questions (1–100)'} value={maximum} onChangeText={setMaximum} keyboardType="number-pad" maxLength={3} placeholder="20" />
      <Text style={{ color: palette.muted, marginBottom: 14 }}>After saving, open it to add and manage {kind === 'deck' ? 'flashcards' : 'questions'}.</Text>
      <AppButton 
        title={saving ? 'Saving...' : buttonLabel} 
        onPress={save} 
        style={styles.button} 
      />

      
    </>
  );
}

const styles = StyleSheet.create({//para sa Style 

  eyebrow: { 
    color: palette.muted, 
    fontSize: 10, 
    fontWeight: '700', 
    letterSpacing: 1.5, 
    marginBottom: 10 
  },

  title: { 
    color: palette.ink, 
    fontSize: 29, 
    fontWeight: '700', 
    letterSpacing: -1 
  },

  description: { color: palette.muted, 
    fontSize: 13, 
    lineHeight: 19, 
    marginTop: 7, 
    marginBottom: 25 
  },
  
  button: { 
    marginTop: 6 
  },


  note: { 
    color: palette.muted, 
    fontSize: 10, 
    textAlign: 'center', 
    marginTop: 16 
  },
});
