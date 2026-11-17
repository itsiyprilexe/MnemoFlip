import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { StudyContent } from '../types/models';
import { palette } from '../theme';

type Props = { items: StudyContent[] };

export function FlashcardViewer({ items }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [width, setWidth] = useState(320);
  const scale = useRef(new Animated.Value(1)).current;
  const offset = useRef(new Animated.Value(0)).current;
  const animating = useRef(false);
  const currentIndex = Math.min(index, Math.max(0, items.length - 1));
  const current = items[currentIndex];

  useEffect(() => { setIndex(value => Math.min(value, Math.max(0, items.length - 1))); }, [items.length]);
  useEffect(() => { setFlipped(false); scale.setValue(1); }, [current?.id, scale]);

  const flip = () => {
    if (animating.current) return;
    animating.current = true;
    Animated.timing(scale, { toValue: 0, duration: 150, useNativeDriver: true }).start(({ finished }) => {
      if (!finished) { animating.current = false; return; }
      setFlipped(value => !value);
      Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }).start(() => { animating.current = false; });
    });
  };
  const move = (direction: number) => {
    const next = currentIndex + direction;
    if (animating.current || next < 0 || next >= items.length) return;
    animating.current = true;
    const distance = width + 24;
    Animated.timing(offset, { toValue: -direction * distance, duration: 180, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(({ finished }) => {
      if (!finished) { animating.current = false; return; }
      setFlipped(false);
      setIndex(next);
      offset.setValue(direction * distance);
      Animated.timing(offset, { toValue: 0, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(() => { animating.current = false; });
    });
  };
  const pan = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => !animating.current && Math.abs(gesture.dx) > 10 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5,
    onPanResponderGrant: () => offset.stopAnimation(),
    onPanResponderMove: (_, gesture) => {
      const atEdge = (gesture.dx > 0 && currentIndex === 0) || (gesture.dx < 0 && currentIndex === items.length - 1);
      offset.setValue(gesture.dx * (atEdge ? 0.2 : 1));
    },
    onPanResponderRelease: (_, gesture) => {
      const direction = gesture.dx < 0 ? 1 : -1;
      const canMove = currentIndex + direction >= 0 && currentIndex + direction < items.length;
      if (canMove && (Math.abs(gesture.dx) > width * 0.2 || Math.abs(gesture.vx) > 0.5)) move(direction);
      else Animated.spring(offset, { toValue: 0, useNativeDriver: true, speed: 22, bounciness: 2 }).start();
    },
    onPanResponderTerminate: () => Animated.spring(offset, { toValue: 0, useNativeDriver: true, speed: 22, bounciness: 2 }).start(),
  }), [currentIndex, items.length, width]);

  if (!current) return null;
  const count = `${String(currentIndex + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
  return <View>
    <View {...pan.panHandlers} onLayout={event => setWidth(event.nativeEvent.layout.width || 320)} style={styles.viewport}>
      <Animated.View style={{ transform: [{ translateX: offset }, { scaleX: scale }] }}>
        <Pressable accessibilityRole="button" accessibilityLabel={`${flipped ? 'Answer' : 'Question'}: ${flipped ? current.answer : current.question}. ${count}. Double tap to flip.`} accessibilityActions={[{ name: 'increment', label: 'Next flashcard' }, { name: 'decrement', label: 'Previous flashcard' }]} onAccessibilityAction={event => { if (event.nativeEvent.actionName === 'increment') move(1); else if (event.nativeEvent.actionName === 'decrement') move(-1); }} onPress={flip} style={[styles.card, flipped && styles.answerCard]}>
          <View style={styles.top}><Text style={[styles.label, flipped && styles.lightLabel]}>{flipped ? 'ANSWER' : 'QUESTION'}</Text><Text style={[styles.label, flipped && styles.lightLabel]}>{count}</Text></View>
          <Text style={[styles.content, flipped && styles.lightText]}>{flipped ? current.answer : current.question}</Text>
          <View style={styles.hintRow}><Ionicons name="swap-horizontal-outline" size={16} color={flipped ? '#E0ECE1' : palette.green} /><Text style={[styles.hint, flipped && styles.lightLabel]}>{flipped ? 'Tap to see question' : 'Tap anywhere to reveal answer'}</Text></View>
        </Pressable>
      </Animated.View>
    </View>
    <Text style={styles.swipeHint}>Swipe left or right to view cards</Text>
  </View>;
}

const styles = StyleSheet.create({
  viewport: { overflow: 'hidden' },
  card: { minHeight: 220, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, borderRadius: 20, padding: 17, justifyContent: 'space-between' },
  answerCard: { backgroundColor: '#315D48', borderColor: '#315D48' },
  top: { flexDirection: 'row', justifyContent: 'space-between' }, label: { color: palette.muted, fontSize: 10, fontWeight: '700' },
  content: { color: '#294638', fontSize: 20, fontWeight: '700', textAlign: 'center', paddingVertical: 26 }, lightText: { color: '#FFFFFF' }, lightLabel: { color: '#E0ECE1' },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 8 }, hint: { color: palette.green, fontSize: 11 },
  swipeHint: { textAlign: 'center', color: palette.muted, fontSize: 11, marginTop: 12 },
});
