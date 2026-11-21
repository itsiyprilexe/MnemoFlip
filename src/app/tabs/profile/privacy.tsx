import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormScreenHeader } from '../../../components/FormScreenHeader';
import { palette } from '../../../theme';

export default function PrivacyScreen() {
  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
    
    <FormScreenHeader fallbackHref="/profile" />
    <Text style={styles.eyebrow}>YOUR INFORMATION</Text>
    <Text style={styles.title}>Privacy &amp; terms</Text>

    <View style={styles.card}>
      <Text style={styles.heading}>Your account and study data</Text>
      <Text style={styles.body}>MnemoFlip uses Firebase Authentication for your account and Cloud Firestore to store your decks, flashcards, quizzes, and questions.</Text>
      <Text style={styles.body}>You can request account deletion in Account settings. If the deletion is interrupted, some data may already have been removed.</Text>
    </View>

    <View style={styles.card}>
      <Text style={styles.heading}>Privacy policy and terms</Text>
      <Text style={styles.body}>The app owner has not provided a full privacy policy or terms of use yet.</Text>
    </View>
  </ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: palette.background
  },

  page: {
    padding: 22,
    paddingBottom: 120
  },

  eyebrow: {
    color: palette.muted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 9
  },

  title: {
    color: '#294638',
    fontSize: 27,
    fontWeight: '700',
    marginBottom: 20
  },

  card: {
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 17,
    marginBottom: 12
  },

  heading: {
    color: '#294638',
    fontSize: 15,
    fontWeight: '700'
  },

  body: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10
  }
}
);
