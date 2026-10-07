import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { palette } from '../theme';

type Props = TextInputProps & { label: string };

export function TextField({ label, multiline, style, ...inputProps }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        multiline={multiline}
        placeholderTextColor={palette.muted}
        style={[styles.input, multiline && styles.multiline, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  field: { 
    marginBottom: 18 
  },

  label: { 
    color: palette.ink, 
    fontSize: 12, 
    fontWeight: '700', 
    marginBottom: 8 
  },

  input: { 
    minHeight: 50, 
    borderWidth: 1, 
    borderColor: palette.line, 
    borderRadius: 14, 
    paddingHorizontal: 14, 
    paddingVertical: 12, 
    backgroundColor: palette.surface, 
    color: palette.ink, 
    fontSize: 14 },

  multiline: { 
    minHeight: 104, 
    textAlignVertical: 'top' 
  },
});
