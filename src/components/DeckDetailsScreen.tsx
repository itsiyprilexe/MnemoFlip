import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormScreenHeader } from './FormScreenHeader';
import { ContentManager } from './ContentManager';
import { useDecks } from '../hooks/useDecks';
import { palette } from '../theme';

export default function DeckScreen() {
  const { id, add } = useLocalSearchParams<{ id: string; add?: string }>();
  const { decks, loading, error } = useDecks();
  const found = decks.find(item => item.id === id);
  const deck = found ? { ...found, tint: palette.lilac, icon: 'albums-outline' as const, color: palette.green, detail: found.description } : null;

  return (
    
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <FormScreenHeader fallbackHref="/decks" />
        {loading ? <Text>Loading deck...</Text> : error ? <Text>Could not load deck: {error}</Text> : deck ? (
          <>
            <View style={[styles.heroIcon, { backgroundColor: deck.tint }]}>
              <Ionicons name={deck.icon} size={28} color={deck.color} />
            </View>
            <Text style={styles.eyebrow}>YOUR STUDY DECK</Text>
            <Text style={styles.title}>{deck.title}</Text>
            <Text style={styles.description}>{deck.detail}</Text>
            <ContentManager kind="deck" itemId={id} maxItems={deck.maxItems} addMode={add === 'true'} />
          </>
        ) : (
          <View style={styles.notFound}>
            <Text style={styles.title}>Deck not found</Text>
            <Text style={styles.description}>Choose a deck from your library.</Text>
          </View>
        )}
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

  heroIcon: { 
    width: 58, 
    height: 58, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 18 
  },

  eyebrow: { 
    color: palette.muted, 
    fontSize: 10, 
    fontWeight: '700', 
    letterSpacing: 1.5,
     marginBottom: 9 
  },

  title: { 
    color: palette.ink, 
    fontSize: 29, 
    lineHeight: 35, 
    fontWeight: '700', 
    letterSpacing: -1 
  },

  description: { 
    color: palette.muted, 
    fontSize: 13, 
    lineHeight: 19, 
    marginTop: 7, 
    marginBottom: 20 
  },

  studyButton: { 
    marginBottom: 27 
  },

  card: { 
    backgroundColor: palette.surface, 
    borderWidth: 1, 
    borderColor: palette.line, 
    borderRadius: 19, 
    padding: 17, 
    marginBottom: 11 
  },

  cardIndex: { 
    alignSelf: 'flex-start', 
    minWidth: 29, 
    height: 27, 
    borderRadius: 9,
    backgroundColor: palette.background, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 7, 
    marginBottom: 13 
  },

  cardIndexText: { 
    color: palette.muted, 
    fontSize: 9, 
    fontWeight: '700' 
  },

  cardLabel: { 
    color: palette.green, 
    fontSize: 9, 
    fontWeight: '800', 
    letterSpacing: 1.1 
  },

  question: { 
    color: palette.ink, 
    fontSize: 15, 
    fontWeight: '700', 
    lineHeight: 22, 
    marginTop: 6 
  },

  divider: { 
    height: StyleSheet.hairlineWidth, 
    backgroundColor: palette.line, 
    marginVertical: 14 
  },
  
  answer: { 
    color: palette.muted, 
    fontSize: 13, 
    lineHeight: 20, 
    marginTop: 6 
  },

  notFound: { 
    paddingTop: 25 
  },
});
