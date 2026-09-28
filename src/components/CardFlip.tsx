import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface CardFlipProps {
  question: string;
  answer: string;
}

export const CardFlip: React.FC<CardFlipProps> = ({ question, answer }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.card, showAnswer ? styles.cardBack : styles.cardFront]}
      onPress={() => setShowAnswer(!showAnswer)}
    >
      <Text style={styles.cardType}>{showAnswer ? 'ANSWER' : 'QUESTION'}</Text>
      <Text style={styles.cardContent}>{showAnswer ? answer : question}</Text>
      <Text style={styles.hintText}>Tap to flip</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 220,
    width: '100%',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  cardBack: {
    backgroundColor: '#EBF3FA',
    borderWidth: 2,
    borderColor: '#2ECC71',
  },
  cardType: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 1,
  },
  cardContent: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#2C3E50',
  },
  hintText: {
    fontSize: 12,
    color: '#AAA',
    fontStyle: 'italic',
  },
});