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
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <FormScreenHeader fallbackHref="/tabs/decks" />
        {loading ? <Text>Loading deck...</Text> : error ? <Text>Could not load deck: {error}</Text> : deck ? (
          <>
            {add !== 'true' && <View style={styles.deckHeader}><View style={styles.deckHeaderTop}><View style={[styles.heroIcon, { backgroundColor: palette.greenLight }]}>
              <Ionicons name={deck.icon} size={28} color={deck.color} />
            </View><View style={styles.deckCount}><Ionicons name="copy-outline" size={14} color={palette.green} /><Text style={styles.deckCountText}>{deck.itemCount} {deck.itemCount === 1 ? 'card' : 'cards'}</Text></View></View>
            <Text style={styles.eyebrow}>YOUR STUDY DECK</Text>
            <Text style={styles.title}>{deck.title}</Text>
            {!!deck.detail && <Text style={styles.deckDescription}>{deck.detail}</Text>}</View>}
            <ContentManager kind="deck" itemId={id} maxItems={deck.maxItems} addMode={add === 'true'} deckTitle={deck.title} />
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

  deckHeader: { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, borderRadius: 20, padding: 18 },
  deckHeaderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  deckCount: { backgroundColor: palette.greenLight, borderRadius: 20, paddingVertical: 7, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 5 },
  deckCountText: { color: palette.green, fontSize: 11, fontWeight: '700' },
  deckDescription: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 7 },

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
