import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { deleteItem } from '../services/itemService';
import type { StudyCollection } from '../data/study';
import { palette } from '../theme';
import { confirmDelete, showDeleteError } from './deleteConfirmation';

export function CollectionCard({ collection, index, showActions = false }: { collection: StudyCollection; index: number; showActions?: boolean }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const section = pathname.startsWith('/home') ? 'home' : 'decks';
  const remove = () => {
    if (!user) return;
    confirmDelete('Delete deck?', `Delete "${collection.title}"? Remove its flashcards first.`, () => {
      deleteItem(user.uid, 'deck', collection.id).catch(error => showDeleteError('Could not delete deck', error));
    });
  };
  return <View style={styles.card}>
    <Pressable accessibilityRole="button" accessibilityLabel={`Open ${collection.title}`} onPress={() => router.push(`/${section}/deck/${collection.id}`)} style={styles.main}>
      <View style={[styles.icon, { backgroundColor: collection.tint }]}><Ionicons name={collection.icon} size={22} color={collection.color} /></View>
      <View style={styles.text}><Text style={styles.title}>{collection.title}</Text><Text style={styles.detail}>{collection.detail}</Text></View>
      {!showActions && <View style={styles.count}><Text style={styles.countText}>{String(index + 1).padStart(2, '0')}</Text></View>}
    </Pressable>
    {showActions && <View style={styles.actions}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Add flashcard to ${collection.title}`} onPress={() => router.push({ pathname: '/(tabs)/decks/deck/[id]', params: { id: collection.id, add: 'true' } })} style={styles.action}><Ionicons name="add-circle-outline" size={21} color={palette.green} /></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`Edit ${collection.title}`} onPress={() => router.push({ pathname: '/(tabs)/decks/edit/[id]', params: { id: collection.id } })} style={styles.action}><Ionicons name="create-outline" size={21} color={palette.green} /></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${collection.title}`} onPress={remove} style={styles.action}><Ionicons name="trash-outline" size={20} color="#A64E46" /></Pressable>
    </View>}
  </View>;
}
const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: palette.surface, borderRadius: 17, borderWidth: 1, borderColor: palette.line, marginBottom: 9 },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 12 },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, marginLeft: 12 }, title: { color: palette.ink, fontSize: 14, fontWeight: '700' }, detail: { color: palette.muted, fontSize: 10, marginTop: 4 },
  count: { width: 29, height: 29, borderRadius: 10, backgroundColor: palette.background, alignItems: 'center', justifyContent: 'center' }, countText: { color: palette.muted, fontSize: 9, fontWeight: '700' },
  actions: { flexDirection: 'row', alignItems: 'center', paddingRight: 5 }, action: { minWidth: 42, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
});
