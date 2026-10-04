// _________Props interface_____________________________________________
// Explain
import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// _________StyledTextInput component_____________________________________________
// Explain
interface StyledTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

// ______________________________________________________
// Explain
export const StyledTextInput: React.FC<StyledTextInputProps> = ({ label, error, style, ...props }) => {
  const { colors } = useTheme();
  
  // ______________________________________________________
  // Explain
  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.heading }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          {
            borderColor: colors.border,
            backgroundColor: colors.card,
            color: colors.text,
          },
          error ? { borderColor: colors.danger } : null,
          style,
        ]}
        placeholderTextColor={colors.muted}
        {...props}
        />
      {error && <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>}
    </View>
  );
};

// ______________________________________________________
// Explain
const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});