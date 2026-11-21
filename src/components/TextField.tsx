import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { palette } from '../theme';

type Props = TextInputProps & { label: string; error?: string };



export function TextField({ label, error, multiline, style, ...inputProps }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput

        {...inputProps}
        multiline={multiline}
        placeholderTextColor={palette.muted}
        style={[styles.input, multiline && styles.multiline, style]}
      />
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({// para sa design ngan layout san textfield

  field: {
    marginBottom: 18
  },

  label: {
    color: palette.ink,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8
  },

  error: { color: '#A64E46', fontSize: 12, marginTop: 6 },

  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: palette.surface,
    color: palette.ink,
    fontSize: 14
  },

  multiline: {
    minHeight: 104,
    textAlignVertical: 'top'
  },
});
