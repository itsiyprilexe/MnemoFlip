import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      <View style={styles.icon}><Ionicons name={kind === 'deck' ? 'albums-outline' : 'help-circle-outline'} size={24} color={palette.green} /></View>
      <Text style={styles.eyebrow}>YOUR LIBRARY</Text>
      <Text style={styles.title}>{id ? `Edit ${kind}` : `Add a ${kind}`}</Text>

      <Text style={styles.description}>
        {id ? `Make this ${itemName} feel just right.` : `Create a space for what you're learning.`}
      </Text>

      {loading ? <Text>Loading...</Text> : loadError ? <Text>{loadError}</Text> : null}
      <View style={styles.formCard}>
      <Text style={styles.formTitle}>{kind === 'deck' ? 'Deck details' : 'Quiz details'}</Text>
      <Text style={styles.formSubtitle}>Give it a name and a little context.</Text>
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

      <View style={styles.divider} />
      <TextField label={kind === 'deck' ? 'Maximum flashcards (1-100)' : 'Maximum questions (1-100)'} value={maximum} onChangeText={setMaximum} keyboardType="number-pad" maxLength={3} placeholder="20" />
      <Text style={styles.helper}>Choose how many {kind === 'deck' ? 'flashcards' : 'questions'} this {itemName} can hold.</Text>
      </View>
      <View style={styles.tip}><Ionicons name="sparkles-outline" size={19} color={palette.green} /><Text style={styles.tipText}>You can update these details whenever you need.</Text></View>
      <AppButton 
        title={saving ? 'Saving...' : buttonLabel} 
        onPress={save} 
        style={styles.button} 
      />

      
    </>
  );
}

const styles = StyleSheet.create({//para sa Style 

  icon: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.greenLight, marginBottom: 18 },
  formCard: { backgroundColor: palette.surface, borderColor: palette.line, borderWidth: 1, borderRadius: 20, padding: 18 },
  formTitle: { color: '#294638', fontSize: 16, fontWeight: '700' },
  formSubtitle: { color: palette.muted, fontSize: 11, marginTop: 5, marginBottom: 20 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: palette.line, marginBottom: 18 },
  helper: { color: palette.muted, fontSize: 11, lineHeight: 16, marginTop: -8 },
  tip: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: palette.greenLight, padding: 14, borderRadius: 14, marginTop: 16, marginBottom: 12 },
  tipText: { color: '#496455', flex: 1, fontSize: 11, lineHeight: 16 },

  eyebrow: { 
    color: palette.muted, 
    fontSize: 10, 
    fontWeight: '700', 
    letterSpacing: 1.5, 
    marginBottom: 10 
  },

  title: { 
    color: '#294638', 
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
