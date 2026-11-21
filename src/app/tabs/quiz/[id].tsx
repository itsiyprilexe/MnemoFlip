import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ContentManager } from '../../../components/ContentManager';
import { FormScreenHeader } from '../../../components/FormScreenHeader';
import { useItems } from '../../../hooks/useItems';
import { palette } from '../../../theme';
export default function QuizDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, loading, error } = useItems('quiz');
  const quiz = items.find(item => item.id === id);
  function openSettings() {
    router.push({ pathname: '/(tabs)/quiz/edit/[id]', params: { id } });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <FormScreenHeader fallbackHref="/quiz" />
        {loading ? (
          <Text>Loading quiz...</Text>
        ) : error ? (
          <Text>Could not load quiz: {error}</Text>
        ) : !quiz ? (
          <Text>Quiz not found.</Text>
        ) : (
          <>
            <View style={styles.hero}>
              <View style={styles.heroTop}>
                <View style={styles.icon}>
                  <Ionicons name="help-circle-outline" size={24} color={palette.green} />
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel="Quiz settings" onPress={openSettings} style={styles.settings}>
                  <Ionicons name="settings-outline" size={17} color={palette.green} />
                  <Text style={styles.settingsText}>Settings</Text>
                </Pressable>
              </View>
              <Text style={styles.eyebrow}>YOUR QUIZ</Text>
              <Text style={styles.title}>{quiz.title}</Text>
              {!!quiz.description && <Text style={styles.description}>{quiz.description}</Text>}
            </View>
            <ContentManager kind="quiz" itemId={id} maxItems={quiz.maxItems} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: palette.background }, page: { padding: 22, paddingBottom: 120 }, hero: { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, borderRadius: 20, padding: 18 }, heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 17 }, icon: { width: 48, height: 48, borderRadius: 15, backgroundColor: palette.greenLight, alignItems: 'center', justifyContent: 'center' }, settings: { minHeight: 40, paddingHorizontal: 12, borderRadius: 14, backgroundColor: palette.greenLight, flexDirection: 'row', gap: 6, alignItems: 'center' }, settingsText: { color: palette.green, fontSize: 11, fontWeight: '700' }, eyebrow: { color: palette.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1.3, marginBottom: 8 }, title: { fontSize: 26, fontWeight: '700', color: '#294638' }, description: { marginTop: 7, fontSize: 13, color: palette.muted } });
