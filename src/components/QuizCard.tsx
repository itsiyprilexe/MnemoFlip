import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { deleteItem } from '../services/itemService';
import type { Quiz } from '../types/models';
import { palette } from '../theme';
import { confirmDelete, showDeleteError } from './deleteConfirmation';

export function QuizCard({ quiz }: { quiz: Quiz }) {
  const { user } = useAuth();
  const remove = () => {
    if (!user) return;
    confirmDelete('Delete quiz?', `Delete "${quiz.title}" and all its questions? This cannot be undone.`, () => {
      deleteItem(user.uid, 'quiz', quiz.id).catch(error => showDeleteError('Could not delete quiz', error));
    });
  };
  return <View style={styles.card}>
    <Pressable accessibilityRole="button" accessibilityLabel={`Start ${quiz.title}`} onPress={() => router.push({ pathname: '/tabs/quiz/play/[id]', params: { id: quiz.id } })} style={styles.main}>
      <View style={styles.icon}><Ionicons name="help-circle-outline" size={22} color={palette.green} /></View>
      <View style={styles.content}><Text style={styles.title}>{quiz.title}</Text><Text style={styles.description}>{quiz.description}</Text><Text style={styles.count}>{quiz.itemCount} {quiz.itemCount === 1 ? 'question' : 'questions'}</Text></View>
    </Pressable>
    <View style={styles.actions}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Edit ${quiz.title}`} onPress={() => router.push({ pathname: '/tabs/quiz/[id]', params: { id: quiz.id } })} style={styles.action}><Ionicons name="create-outline" size={21} color={palette.green} /></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${quiz.title}`} onPress={remove} style={styles.action}><Ionicons name="trash-outline" size={20} color="#A64E46" /></Pressable>
    </View>
  </View>;
}
const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: palette.surface, borderRadius: 17, borderWidth: 1, borderColor: palette.line, marginBottom: 10 },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 13 },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.greenLight, marginRight: 12 },
  content: { flex: 1 }, title: { color: palette.ink, fontSize: 13, fontWeight: '700' }, description: { color: palette.muted, fontSize: 10, marginTop: 4 }, count: { color: palette.green, fontSize: 10, marginTop: 5 },
  actions: { flexDirection: 'row', alignItems: 'center', paddingRight: 5 }, action: { minWidth: 42, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
});
