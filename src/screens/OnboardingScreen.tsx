import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.stack}>
            <View style={[styles.layer, styles.layerBack]} />
            <View style={[styles.layer, styles.layerMid]} />
            <View style={[styles.layer, styles.layerFront]}>
              <Ionicons name="bulb" size={52} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.title}>FlashCard</Text>
          <Text style={styles.subtitle}>
            Create your own study decks, flip cards, take quizzes, and track your progress.
          </Text>
        </View>

        <PrimaryButton title="Get Started" onPress={() => navigation.navigate('Login')} />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: spacing.lg, justifyContent: 'space-between' },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stack: { width: 170, height: 150, marginBottom: spacing.xl },
  layer: { position: 'absolute', width: 110, height: 110, borderRadius: radius.lg },
  layerBack: { backgroundColor: '#DBEAFE', left: 46, top: 0, transform: [{ rotate: '10deg' }] },
  layerMid: { backgroundColor: '#93C5FD', left: 10, top: 14, transform: [{ rotate: '-8deg' }] },
  layerFront: {
    backgroundColor: colors.card,
    left: 30,
    top: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.heading,
  },
  title: { fontSize: 44, fontWeight: '800', color: colors.heading, marginBottom: spacing.sm },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
});