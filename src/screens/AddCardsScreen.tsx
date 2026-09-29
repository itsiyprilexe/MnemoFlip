import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { colors, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AddCards'>;

export const AddCardsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { deckId } = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} hitSlop={12}>
        <Ionicons name="chevron-back" size={28} color={colors.heading} />
      </TouchableOpacity>

      <View style={styles.body}>
        <Text style={styles.title}>Add Cards</Text>
        <Text style={styles.subtitle}>Choose how you want to add cards to your deck.</Text>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('AddCard', { deckId })}
        >
          <View style={[styles.tile, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="create-outline" size={28} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>Add Manually</Text>
            <Text style={styles.optionMeta}>Create cards one by one</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.muted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ImportCards', { deckId })}
        >
          <View style={[styles.tile, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="document-attach-outline" size={28} color="#D97706" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>Import from File</Text>
            <Text style={styles.optionMeta}>PDF, Word, or PowerPoint</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.muted} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddCardsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  back: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, alignSelf: 'flex-start' },
  body: { padding: spacing.md },
  title: { fontSize: 32, fontWeight: '800', color: colors.heading, marginTop: spacing.md },
  subtitle: { fontSize: 16, color: colors.muted, marginTop: 6, marginBottom: spacing.lg },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  tile: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  optionTitle: { fontSize: 18, fontWeight: '700', color: colors.heading },
  optionMeta: { fontSize: 14, color: colors.muted, marginTop: 2 },
});