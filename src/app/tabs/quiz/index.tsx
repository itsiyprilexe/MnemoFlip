import React from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandHeader } from '../../../components/BrandHeader';
import { QuizCard } from '../../../components/QuizCard';
import { useItems } from '../../../hooks/useItems';
import { palette } from '../../../theme';

/**
 * Main screen components ini para sa quizzes. 
 * gin didisplay an headers, "Add Quiz" button, and list san mga quizzes.
 */
export default function QuizzesScreen() {
  // Navigation hook para mag navigate sa iba pa na screens
  const router = useRouter();
  const { items: quizzes, loading, error } = useItems('quiz');

  return (
    // SafeAreaView para masecure an content sa device screen boundaries
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Allows content to scroll vertically */}
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>

      {/* Displays the top app branding header */}
        <BrandHeader />

        {/* Header titles and descriptions */}
        <Text style={styles.eyebrow}>A LITTLE KNOWLEDGE CHECK</Text>
        <Text style={styles.title}>Your quizzes</Text>
        <Text style={styles.description}>Quick reviews to help ideas stick.</Text>

        <View style={styles.summary}>
          <Text style={styles.summaryValue}>{loading ? '–' : error ? '–' : quizzes.length}</Text>
          <View style={styles.summaryText}><Text style={styles.summaryTitle}>Quizzes</Text><Text style={styles.summaryNote}>A few questions to explore</Text></View>
        </View>

        <View style={styles.libraryRow}><View style={styles.libraryText}><Text style={styles.sectionTitle}>Quiz library</Text><Text style={styles.count}>{quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Add a quiz" onPress={() => router.push('/tabs/quiz/create')} style={styles.addButton}><Ionicons name="add" size={21} color={palette.green} /></Pressable></View>
        {loading ? <Text>Loading quizzes...</Text> : error ? <Text>Could not load quizzes: {error}</Text> : quizzes.length === 0 ? <Text>No quizzes yet. Add your first quiz.</Text> : null}
        {quizzes.map((quiz) => <QuizCard
          key={quiz.id}
          quiz={quiz}
        />)}

        <Text style={styles.note}>Tap a quiz to start. Use the icons to edit or delete.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: palette.background
  },

  page: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 126
  },

  eyebrow: {
    fontSize: 10,
    color: palette.muted,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginBottom: 10
  },

  title: {
    fontSize: 29,
    lineHeight: 35,
    fontWeight: '700',
    letterSpacing: -1,
    color: palette.ink
  },

  description: {
    marginTop: 7,
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 23
  },

  summary: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: palette.green, borderRadius: 20, padding: 17, marginBottom: 28 },
  summaryValue: { color: '#FFFFFF', fontSize: 32, fontWeight: '700', letterSpacing: -1 },
  summaryText: { flex: 1 },
  summaryTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  summaryNote: { color: '#E2E9DF', fontSize: 10, marginTop: 4 },

  libraryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 13 },
  libraryText: { flex: 1 },
  addButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: palette.surface, borderColor: palette.line, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

  sectionTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 0
  },

  count: {
    color: palette.muted,
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600'
  },

  note: {
    color: palette.muted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8
  },
});
