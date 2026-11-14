import React from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandHeader } from '../../../components/BrandHeader';
import { CollectionCard } from '../../../components/CollectionCard';
import { AppButton } from '../../../components/AppButton';
import { SectionHeading } from '../../../components/SectionHeading';
import { useDecks } from '../../../hooks/useDecks';
import { palette } from '../../../theme';

export default function CollectionsScreen() {
  const { decks, loading, error } = useDecks();
  const collections = decks.map(deck => ({ id: deck.id, title: deck.title, detail: deck.description || 'Study deck', icon: 'albums-outline' as const, tint: palette.lilac, color: palette.green }));
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <BrandHeader />
        <Text style={styles.eyebrow}>YOUR LIBRARY</Text>
        <Text style={styles.title}>Your decks</Text>
        <Text style={styles.description}>A tidy home for the things you’re learning.</Text>
        <View style={styles.summary}>
          <Text style={styles.summaryValue}>{collections.length}</Text>
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>Study decks</Text>
            <Text style={styles.summaryNote}>A few subjects to explore</Text>
          </View>
        </View>

        <AppButton 
          title="Add a deck" 
          onPress={() => router.push('/decks/create')} 
          style={styles.addButton} 
        />

        <SectionHeading 
          title="Featured decks" 
          note={`${collections.length} sets`} 
        />
        
        {loading ? <Text>Loading decks...</Text> : error ? <Text>Could not load decks: {error}</Text> : collections.length === 0 ? <Text>No decks yet. Add your first deck.</Text> : null}
        {collections.map((deck, index) => <CollectionCard key={deck.id} collection={deck} index={index} showActions />)}

        <View style={styles.note}>
          <Text style={styles.noteText}>Open a deck to view its details.</Text>
        </View>
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
    marginBottom: 21 
  },

  summary: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 13, 
    backgroundColor: palette.green, 
    borderRadius: 20, 
    padding: 17,
    marginBottom: 28 
  },

  summaryValue: { 
    color: '#FFFFFF', 
    fontSize: 32, 
    fontWeight: '700', 
    letterSpacing: -1 
  },

  summaryText: { 
    flex: 1 
  },

  summaryTitle: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontWeight: '700'
  },

  summaryNote: { 
    color: '#E2E9DF', 
    fontSize: 10, 
    marginTop: 4 
  },

  addButton: { 
    marginBottom: 24 
  },

  note: { 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: palette.line, 
    padding: 15, 
    marginTop: 8 
  },

  noteText: { 
    color: palette.muted, 
    textAlign: 'center', 
    fontSize: 11, 
    lineHeight: 17 
  },
});
