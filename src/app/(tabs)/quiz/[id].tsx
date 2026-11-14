import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { AppButton } from '../../../components/AppButton';
import { ContentManager } from '../../../components/ContentManager';
import { FormScreenHeader } from '../../../components/FormScreenHeader';
import { useItems } from '../../../hooks/useItems';
import { palette } from '../../../theme';
export default function QuizDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, loading, error } = useItems('quiz');
  const quiz = items.find(item => item.id === id);
  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={styles.page}>
    <FormScreenHeader fallbackHref="/quiz" />
    {loading ? <Text>Loading quiz...</Text> : error ? <Text>Could not load quiz: {error}</Text> : !quiz ? <Text>Quiz not found.</Text> : <>
      <Text style={styles.title}>{quiz.title}</Text><Text style={styles.description}>{quiz.description || 'No description'}</Text>
      <AppButton title="Quiz settings" onPress={() => router.push({ pathname: '/(tabs)/quiz/edit/[id]', params: { id } })} style={{ marginBottom: 10 }} />
      <ContentManager kind="quiz" itemId={id} maxItems={quiz.maxItems} />
    </>}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: palette.background }, page: { padding: 22 }, title: { fontSize: 29, fontWeight: '700', color: palette.ink }, description: { marginVertical: 20, color: palette.muted } });
