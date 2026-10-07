import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
};

export function AppButton({ title, onPress, style }: Props) {
  return (
    
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.button, style]}
    >

      <Text style={styles.label}>{title}</Text>

      <Ionicons 
      name="arrow-forward" 
      size={17} color="#FFFFFF"   
    />

    </Pressable>
  );
}

const styles = StyleSheet.create({

  button: { minHeight: 48, borderRadius: 15, backgroundColor: palette.green, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 18 },

  label: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
});
