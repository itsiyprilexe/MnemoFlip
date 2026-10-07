import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { palette } from '../theme';

export function FormScreenHeader() {
  const router = useRouter();
  return (
    <View style={styles.row}>

      <Pressable 
        accessibilityRole="button" 
        accessibilityLabel="Go back" 
        onPress={() => router.back()} style={styles.back}
        >

        <Ionicons 
          name="arrow-back" 
          size={19} 
          color={palette.ink} 
        />
      </Pressable>

      <Text style={styles.label}>MNEMOFLIP</Text>
    </View>
  );
}

const styles = StyleSheet.create({

  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 13, 
    marginBottom: 26 
  },

  back: { 
    width: 40, 
    height: 40, 
    borderRadius: 14,
    backgroundColor: palette.surface, 
    borderWidth: 1, 
    borderColor: palette.line, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  
  label: { 
    color: palette.muted, 
    fontSize: 10, 
    letterSpacing: 1.4, 
    fontWeight: '800'
  },
});
