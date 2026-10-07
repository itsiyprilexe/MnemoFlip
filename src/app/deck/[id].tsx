import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../components/AppButton';
import { FormScreenHeader } from '../../components/FormScreenHeader';
import { SectionHeading } from '../../components/SectionHeading';
import { collections, deckCardPreviews } from '../../data/study';
import { palette } from '../../theme';

export default function DeckScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const deck = collections.find((collection) => collection.id === id);
  const cards = deck ? deckCardPreviews[deck.id] ?? [] : [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <FormScreenHeader />
        {deck ? (
          <>
            <View style={[styles.heroIcon, { backgroundColor: deck.tint }]}>
              <Ionicons name={deck.icon} size={28} color={deck.color} />
            </View>
            <Text style={styles.eyebrow}>YOUR STUDY DECK</Text>
            <Text style={styles.title}>{deck.title}</Text>
            <Text style={styles.description}>{deck.detail}</Text>
            <AppButton
              title="Start studying"
              onPress={() => Alert.alert('Under construction', 'Study mode is coming soon.')}
              style={styles.studyButton}
            />
            <SectionHeading title="Card preview" note={`${cards.length} sample cards`} />
            {cards.map((card, index) => (
              <View style={styles.card} key={`${deck.id}-${index}`}>
                <View style={styles.cardIndex}><Text style={styles.cardIndexText}>{String(index + 1).padStart(2, '0')}</Text></View>
                <Text style={styles.cardLabel}>QUESTION</Text>
                <Text style={styles.question}>{card.question}</Text>
                <View style={styles.divider} />
                <Text style={styles.cardLabel}>ANSWER</Text>
                <Text style={styles.answer}>{card.answer}</Text>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.notFound}>
            <Text style={styles.title}>Deck not found</Text>
            <Text style={styles.description}>Choose one of the sample decks from your library.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD

  safeArea: { flex: 1, backgroundColor: palette.background },

  page: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 126 },

  heroIcon: { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },

  eyebrow: { color: palette.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 9 },

  title: { color: palette.ink, fontSize: 29, lineHeight: 35, fontWeight: '700', letterSpacing: -1 },

  description: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 7, marginBottom: 20 },

  studyButton: { marginBottom: 27 },

  card: { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, borderRadius: 19, padding: 17, marginBottom: 11 },

  cardIndex: { alignSelf: 'flex-start', minWidth: 29, height: 27, borderRadius: 9, backgroundColor: palette.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 7, marginBottom: 13 },

  cardIndexText: { color: palette.muted, fontSize: 9, fontWeight: '700' },

  cardLabel: { color: palette.green, fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },

  question: { color: palette.ink, fontSize: 15, fontWeight: '700', lineHeight: 22, marginTop: 6 },

  divider: { height: StyleSheet.hairlineWidth, backgroundColor: palette.line, marginVertical: 14 },
  
=======
  safeArea: { flex: 1, backgroundColor: palette.background },
  page: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 126 },
  heroIcon: { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  eyebrow: { color: palette.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 9 },
  title: { color: palette.ink, fontSize: 29, lineHeight: 35, fontWeight: '700', letterSpacing: -1 },
  description: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 7, marginBottom: 20 },
  studyButton: { marginBottom: 27 },
  card: { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, borderRadius: 19, padding: 17, marginBottom: 11 },
  cardIndex: { alignSelf: 'flex-start', minWidth: 29, height: 27, borderRadius: 9, backgroundColor: palette.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 7, marginBottom: 13 },
  cardIndexText: { color: palette.muted, fontSize: 9, fontWeight: '700' },
  cardLabel: { color: palette.green, fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  question: { color: palette.ink, fontSize: 15, fontWeight: '700', lineHeight: 22, marginTop: 6 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: palette.line, marginVertical: 14 },
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
  answer: { color: palette.muted, fontSize: 13, lineHeight: 20, marginTop: 6 },
  notFound: { paddingTop: 25 },
});
