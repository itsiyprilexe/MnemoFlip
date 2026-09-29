import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { useDecks } from '../context/DeckContext';
import { colors, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Study'>;

export const StudyScreen: React.FC<Props> = ({ route, navigation }) => {
  const { deckId } = route.params;
  const { decks } = useDecks();
  const deck = decks.find((d) => d.id === deckId);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [starred, setStarred] = useState<Record<string, boolean>>({});

  if (!deck || deck.cards.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>This deck has no cards yet!</Text>
        <PrimaryButton title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const total = deck.cards.length;
  const card = deck.cards[index];
  const isLast = index === total - 1;

  const go = (next: number) => {
    setIndex(next);
    setFlipped(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="close" size={30} color={colors.heading} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.deckName} numberOfLines={1}>{deck.title}</Text>
          <Text style={styles.progressText}>{index + 1} / {total}</Text>
        </View>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${((index + 1) / total) * 100}%` }]} />
      </View>

      <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => setFlipped((f) => !f)}>
        <TouchableOpacity
          style={styles.star}
          hitSlop={12}
          onPress={() => setStarred((s) => ({ ...s, [card.id]: !s[card.id] }))}
        >
          <Ionicons
            name={starred[card.id] ? 'star' : 'star-outline'}
            size={28}
            color={starred[card.id] ? '#F5B301' : colors.muted}
          />
        </TouchableOpacity>
        <Text style={styles.cardText}>{flipped ? card.answer : card.question}</Text>
        <Text style={styles.tapHint}>{flipped ? 'Tap to see question' : 'Tap to reveal answer'}</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, styles.btnGhost, index === 0 && { opacity: 0.4 }]}
          disabled={index === 0}
          onPress={() => go(index - 1)}
        >
          <Ionicons name="arrow-back" size={20} color={colors.heading} />
          <Text style={[styles.btnText, { color: colors.heading }]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={() => (isLast ? navigation.goBack() : go(index + 1))}
        >
          <Text style={[styles.btnText, { color: '#fff' }]}>{isLast ? 'Finish' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StudyScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: colors.bg },
  emptyText: { fontSize: 18, color: colors.muted, marginBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  headerCenter: { flex: 1, alignItems: 'center' },
  deckName: { fontSize: 18, fontWeight: '800', color: colors.heading },
  progressText: { fontSize: 14, color: colors.muted, marginTop: 2 },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.primarySoft, marginHorizontal: spacing.md, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  card: {
    flex: 1,
    margin: spacing.md,
    backgroundColor: colors.inputBg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  star: { position: 'absolute', top: spacing.md, right: spacing.md },
  cardText: { fontSize: 28, fontWeight: '800', color: colors.heading, textAlign: 'center' },
  tapHint: { position: 'absolute', bottom: spacing.md, fontSize: 15, color: colors.muted },
  footer: { flexDirection: 'row', gap: 12, paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  btn: { flex: 1, height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  btnGhost: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  btnPrimary: { backgroundColor: colors.primary },
  btnText: { fontSize: 17, fontWeight: '700' },
});