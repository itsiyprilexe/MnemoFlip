import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Import data types and color palette theme
import { StudyQuiz } from '../data/study';
import { palette } from '../theme';

export function QuizCard({ quiz }: { quiz: StudyQuiz }) {
  return (
    // Clickable container for the quiz card
    <Pressable
      accessibilityRole="button"
      onPress={() => Alert.alert('Quiz mode under construction', `${quiz.title} is ready to be built out.`)}
      style={styles.card}
    >
      {/* Left side: Icon badge container */}
      <View 
        style={styles.icon}><Ionicons 
        name="help-circle-outline" 
        size={22} 
        color={palette.green} 
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{quiz.title}</Text>
        <Text style={styles.description}>{quiz.description}</Text>
        <Text style={styles.count}>{quiz.questionCount} questions</Text>
      </View>

      {/* Right side: Arrow navigation indicator */}
      <Ionicons 
        name="chevron-forward" 
        size={18} 
        color={palette.muted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({

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
});
