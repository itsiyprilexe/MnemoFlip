import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { palette } from '../theme';

export function BrandHeader() {
  return (
    <View style={styles.row}>

      <Text style={styles.brand}>mnemo<Text style={styles.accent}>flip</Text></Text>

      <View style={styles.spacer} />
      <Link href="/profile" asChild>

        <Pressable 
          accessibilityRole="button" 
          accessibilityLabel="Open profile" 
          style={styles.profile}
          >

          <Ionicons 
            name="person-outline" 
            size={17} 
            color={palette.green} 
          />

        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({

  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 30 
  },

  mark: { 
    width: 30, 
    height: 30, 
    borderRadius: 10, 
    backgroundColor: palette.green, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 9 
  },

  brand: { 
    fontSize: 19, 
    fontWeight: '800', 
    color: palette.ink, 
    letterSpacing: -0.8 
  },

  accent: { 
    color: palette.green 
  },

  spacer: {
    flex: 1 
  },
  
  profile: { 
    width: 38, 
    height: 38, 
    borderRadius: 19, 
    backgroundColor: palette.surface, 
    borderWidth: 1, 
    borderColor: palette.line, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
});
