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
<<<<<<< HEAD
    
=======
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.button, style]}
    >
<<<<<<< HEAD

      <Text style={styles.label}>{title}</Text>

      <Ionicons 
      name="arrow-forward" 
      size={17} color="#FFFFFF"   
    />

=======
      <Text style={styles.label}>{title}</Text>
      <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
    </Pressable>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD

  button: { minHeight: 48, borderRadius: 15, backgroundColor: palette.green, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 18 },

=======
  button: { minHeight: 48, borderRadius: 15, backgroundColor: palette.green, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 18 },
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
  label: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
});
