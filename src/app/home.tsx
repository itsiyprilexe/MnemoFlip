import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../components/AppButton';
import { BrandHeader } from '../components/BrandHeader';
import { CollectionCard } from '../components/CollectionCard';
import { SectionHeading } from '../components/SectionHeading';
import { StatsOverview } from '../components/StatsOverview';
import { WeeklyRhythm } from '../components/WeeklyRhythm';
import { collections } from '../data/study';
import { palette } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        
        <BrandHeader />
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>A MINDFUL LEARNING SPACE</Text>
          <Text style={styles.headline}>A little learning,</Text>
          <Text style={styles.headlineSecond}>a lot of growth.</Text>
          <Text style={styles.introCopy}>Your study space is ready when you are.</Text>
        </View>

        <WeeklyRhythm />
        <View style={styles.stats}><StatsOverview /></View>
        <View style={styles.section}>
          <SectionHeading title="Your collections" note="A few places to begin" />
          {collections.map((collection, index) => <CollectionCard key={collection.title} collection={collection} index={index} />)}
        </View>

        <AppButton
          title="Continue studying"
          onPress={() => Alert.alert('Under construction', 'Study sessions are coming soon.')}
        />

        <View style={styles.quoteCard}>
          <View style={styles.quoteContent}>
            <Text style={styles.quoteText}>Small steps each day lead to big discoveries.</Text>
            <Text style={styles.quoteByline}>A GENTLE REMINDER</Text>
          </View>
        </View>

        <Text style={styles.footer}>MADE FOR CURIOUS MINDS</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: { flex: 1, backgroundColor: palette.background },

  page: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 126 },

  intro: { marginBottom: 21 },

  eyebrow: { fontSize: 10, color: palette.muted, letterSpacing: 1.5, fontWeight: '700', marginBottom: 12 },

  headline: { fontSize: 30, lineHeight: 35, fontWeight: '700', letterSpacing: -1.1, color: palette.ink },

  headlineSecond: { fontSize: 30, lineHeight: 35, fontWeight: '400', letterSpacing: -1.1, color: palette.green },

  introCopy: { marginTop: 9, color: palette.muted, fontSize: 13, lineHeight: 19 },

  stats: { marginTop: 13, marginBottom: 29 },

  section: { marginBottom: 9 },

  quoteCard: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: '#F1E9DC', borderRadius: 18, padding: 15, marginTop: 17 },

  quoteIcon: { width: 36, height: 36, borderRadius: 13, backgroundColor: '#FBF5EA', alignItems: 'center', justifyContent: 'center' },

  quoteContent: { flex: 1 },

  quoteText: { color: '#574A3E', fontSize: 12, lineHeight: 17, fontWeight: '600' },

  quoteByline: { color: '#A18A72', fontSize: 8, letterSpacing: 1, fontWeight: '700', marginTop: 5 },
  
  footer: { color: '#B1B1A9', fontSize: 8, letterSpacing: 1.8, fontWeight: '700', textAlign: 'center', marginTop: 23 },
});
