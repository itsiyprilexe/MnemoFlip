import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyQuiz } from '../data/study';
import { palette } from '../theme';

export function QuizCard({ quiz }: { quiz: StudyQuiz }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => Alert.alert('Quiz mode under construction', `${quiz.title} is ready to be built out.`)}
      style={styles.card}
    >
<<<<<<< HEAD
      <View 
        style={styles.icon}><Ionicons 
        name="help-circle-outline" 
        size={22} 
        color={palette.green} 
        />
      </View>

=======
      <View style={styles.icon}><Ionicons name="help-circle-outline" size={22} color={palette.green} /></View>
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
      <View style={styles.content}>
        <Text style={styles.title}>{quiz.title}</Text>
        <Text style={styles.description}>{quiz.description}</Text>
        <Text style={styles.count}>{quiz.questionCount} questions</Text>
      </View>
<<<<<<< HEAD

      <Ionicons 
        name="chevron-forward" 
        size={18} 
        color={palette.muted}
      />
=======
      <Ionicons name="chevron-forward" size={18} color={palette.muted} />
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
    </Pressable>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD

  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: palette.surface, 
    borderRadius: 17, 
    borderWidth: 1, 
    borderColor: palette.line, 
    padding: 13, 
    marginBottom: 10 
  },

  icon: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: palette.greenLight, 
    marginRight: 12 
  },

  content: { 
    flex: 1 
  },

  title: { 
    color: palette.ink, 
    fontSize: 13, 
    fontWeight: '700' 
  },
  
  description: { 
    color: palette.muted, 
    fontSize: 10, 
    marginTop: 4 
  },

  count: { 
    color: palette.green, 
    fontSize: 9, 
    fontWeight: '700', 
    marginTop: 7 
  },
=======
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: palette.surface, borderRadius: 17, borderWidth: 1, borderColor: palette.line, padding: 13, marginBottom: 10 },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.greenLight, marginRight: 12 },
  content: { flex: 1 },
  title: { color: palette.ink, fontSize: 13, fontWeight: '700' },
  description: { color: palette.muted, fontSize: 10, marginTop: 4 },
  count: { color: palette.green, fontSize: 9, fontWeight: '700', marginTop: 7 },
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
});
