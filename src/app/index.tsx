import React from 'react';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// mao ine an universal theme gin import
import { palette } from '../theme';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.page}>

        {/* Para my Spacing  */}
        <View style={styles.brand}>

        </View>

        <View style={styles.hero}>

          {/* Para sa Icons */}
          <View style={styles.art}>
            <Ionicons name="albums-outline" size={48} color={palette.green} />
          </View>
          {/* Para sa Ubos sa Icons or iya Content */}
          <Text style={styles.eyebrow}>A MINDFUL LEARNING SPACE</Text>
          <Text style={styles.title}>Make room for{ '\n' }what you’ll learn.</Text>
          <Text style={styles.description}>Keep your ideas close and take one small step at a time.</Text>
        </View>

          {/* para sa Spacing  san Login and Sign up Button  */}
        <View style={styles.actions}>
          

          {/* para  Log in Button Routing nag gamit kit Link same iya function sa navigation  */}
          <Link href="/login" asChild>
            {/* Button para sa Login ngan iya style */}
            <Pressable accessibilityRole="button" style={styles.primaryButton}>
              <Text style={styles.primaryText}>Log in</Text>
            </Pressable>

          </Link>

          {/* para  Sign up Button Routing nag gamit kit Link same iya function sa navigation  */}
          <Link href="/signup" asChild>
            {/* Button para sa Signin ngan iya style */}
            <Pressable accessibilityRole="button" style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>Sign up</Text>
            </Pressable>

          </Link>

          {/* Ubos san log in ngan sign in button */}
          <Text style={styles.note}>Preview screens only. Account access is not connected.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
{/* an mga style para didi sa file  */}
const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: palette.background 
  },
  page: { 
    flexGrow: 1, 
    paddingHorizontal: 26, 
    paddingTop: 12, 
    paddingBottom: 24, 
    justifyContent: 'space-between' 
  },
  brand: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 9 
  },
  brandIcon: { 
    width: 42, 
    height: 42, 
    borderRadius: 15, 
    backgroundColor: palette.greenLight, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  brandName: { 
    color: palette.ink, 
    fontWeight: '800', 
    fontSize: 17, 
    letterSpacing: -0.4 
  },
  hero: { 
    alignItems: 'center', 
    paddingTop: 20 
  },
  art: { width: 118, 
    height: 118, 
    borderRadius: 40, 
    backgroundColor: palette.greenLight, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 28 
  },
  eyebrow: { 
    color: palette.muted, 
    fontSize: 10, 
    fontWeight: '700', 
    letterSpacing: 1.5, 
    marginBottom: 12 
  },
  title: { color: palette.ink, 
    fontSize: 34, 
    lineHeight: 40, 
    fontWeight: '700', 
    letterSpacing: -1.3, 
    textAlign: 'center' 
  },
  description: { 
    color: palette.muted, 
    fontSize: 14, 
    lineHeight: 21, 
    textAlign: 'center', 
    maxWidth: 280, 
    marginTop: 13
   },
  actions: { 
    gap: 12 
  },
  primaryButton: { 
    minHeight: 54, 
    borderRadius: 17, 
    backgroundColor: palette.green, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  primaryText: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontWeight: '700' 
  },
  secondaryButton: { 
    minHeight: 54, 
    borderRadius: 17, 
    borderWidth: 1, 
    borderColor: palette.line, 
    backgroundColor: palette.surface, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  secondaryText: { 
    color: palette.ink, 
    fontSize: 14, 
    fontWeight: '700' 
  },
  note: { 
    color: palette.muted, 
    fontSize: 10, 
    textAlign: 'center', 
    marginTop: 4 
  },
});
