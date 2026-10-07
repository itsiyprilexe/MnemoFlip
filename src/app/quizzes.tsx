import React from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandHeader } from '../components/BrandHeader';
import { AppButton } from '../components/AppButton';
import { QuizCard } from '../components/QuizCard';
import { quizzes } from '../data/study';
import { palette } from '../theme';

export default function QuizzesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <BrandHeader />
<<<<<<< HEAD

        <Text style={styles.eyebrow}>A LITTLE KNOWLEDGE CHECK</Text>
        <Text style={styles.title}>Your quizzes</Text>
        <Text style={styles.description}>Quick reviews to help ideas stick.</Text>

        <AppButton 
          title="Add a quiz" 
          onPress={() => router.push('/add-quiz')} 
          style={styles.addButton} 
        />

        <Text 
          style={styles.sectionTitle}>Quiz library <Text 
          style={styles.count}>{quizzes.length}
        </Text>

        </Text>
        {quizzes.map((quiz) => <QuizCard 
          key={quiz.id} 
          quiz={quiz} 
        />)}

=======
        <Text style={styles.eyebrow}>A LITTLE KNOWLEDGE CHECK</Text>
        <Text style={styles.title}>Your quizzes</Text>
        <Text style={styles.description}>Quick reviews to help ideas stick.</Text>
        <AppButton title="Add a quiz" onPress={() => router.push('/add-quiz')} style={styles.addButton} />
        <Text style={styles.sectionTitle}>Quiz library <Text style={styles.count}>{quizzes.length}</Text></Text>
        {quizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)}
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
        <Text style={styles.note}>Quiz questions and play mode are the next step.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD

  safeArea: { flex: 1, backgroundColor: palette.background },

  page: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 126 },

  eyebrow: { fontSize: 10, color: palette.muted, letterSpacing: 1.5, fontWeight: '700', marginBottom: 10 },

  title: { fontSize: 29, lineHeight: 35, fontWeight: '700', letterSpacing: -1, color: palette.ink },

  description: { marginTop: 7, color: palette.muted, fontSize: 13, lineHeight: 19, marginBottom: 23 },

  addButton: { marginBottom: 26 },

  sectionTitle: { color: palette.ink, fontSize: 18, fontWeight: '700', marginBottom: 13 },

  count: { color: palette.muted, fontSize: 13, fontWeight: '600' },
  
=======
  safeArea: { flex: 1, backgroundColor: palette.background },
  page: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 126 },
  eyebrow: { fontSize: 10, color: palette.muted, letterSpacing: 1.5, fontWeight: '700', marginBottom: 10 },
  title: { fontSize: 29, lineHeight: 35, fontWeight: '700', letterSpacing: -1, color: palette.ink },
  description: { marginTop: 7, color: palette.muted, fontSize: 13, lineHeight: 19, marginBottom: 23 },
  addButton: { marginBottom: 26 },
  sectionTitle: { color: palette.ink, fontSize: 18, fontWeight: '700', marginBottom: 13 },
  count: { color: palette.muted, fontSize: 13, fontWeight: '600' },
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
  note: { color: palette.muted, fontSize: 10, textAlign: 'center', marginTop: 8 },
});
