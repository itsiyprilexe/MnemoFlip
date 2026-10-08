import React from 'react';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '../theme';

export default function WelcomeScreen() {
  return (

    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.brand}>
        </View>

        {/* asya ine an sa butnga na content na gi display */}
        <View style={styles.hero}>
          <View style={styles.art}><Ionicons name="albums-outline" size={48} color={palette.green} /></View>
          <Text style={styles.eyebrow}>A MINDFUL LEARNING SPACE</Text>
          <Text style={styles.title}>Make room for{ '\n' }what you’ll learn.</Text>
          <Text style={styles.description}>Keep your ideas close and take one small step at a time.</Text>
        </View>

        <View style={styles.actions}>
          {/* button para ma link sa folder sa login */}
          <Link href="/login" asChild>
            <Pressable accessibilityRole="button" style={styles.primaryButton}>
              <Text style={styles.primaryText}>Log in</Text>
            </Pressable>
          </Link>

          {/* button para ma link sa folder na signup */}
          <Link href="/signup" asChild>
            <Pressable accessibilityRole="button" style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>Sign up</Text>
            </Pressable>
          </Link>

          <Text style={styles.note}>Preview screens only. Account access is not connected.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: { flex: 1, backgroundColor: palette.background },

  page: { flexGrow: 1, paddingHorizontal: 26, paddingTop: 12, paddingBottom: 24, justifyContent: 'space-between' },

  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },

  brandIcon: { width: 42, height: 42, borderRadius: 15, backgroundColor: palette.greenLight, alignItems: 'center', justifyContent: 'center' },

  brandName: { color: palette.ink, fontWeight: '800', fontSize: 17, letterSpacing: -0.4 },

  hero: { alignItems: 'center', paddingTop: 20 },

  art: { width: 118, height: 118, borderRadius: 40, backgroundColor: palette.greenLight, alignItems: 'center', justifyContent: 'center', marginBottom: 28 },

  eyebrow: { color: palette.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 },

  title: { color: palette.ink, fontSize: 34, lineHeight: 40, fontWeight: '700', letterSpacing: -1.3, textAlign: 'center' },

  description: { color: palette.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', maxWidth: 280, marginTop: 13 },

  actions: { gap: 12 },

  primaryButton: { minHeight: 54, borderRadius: 17, backgroundColor: palette.green, alignItems: 'center', justifyContent: 'center' },

  primaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  secondaryButton: { minHeight: 54, borderRadius: 17, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.surface, alignItems: 'center', justifyContent: 'center' },

  secondaryText: { color: palette.ink, fontSize: 14, fontWeight: '700' },

  note: { color: palette.muted, fontSize: 10, textAlign: 'center', marginTop: 4 },
});
