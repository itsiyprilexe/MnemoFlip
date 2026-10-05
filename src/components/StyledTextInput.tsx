// _________IMPORTS_____________________________________________
// Brings in React, standard UI building blocks from React Native (View, Input, Text),
// and your custom theme hook to get colors.
import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// _________PROPS TYPES DEFINITION_____________________________________________
// Tells TypeScript what properties this component accepts:
// - Everything a standard input accepts (placeholder, onChangeText, etc.)
// - Plus an optional 'label' title and an optional 'error' message.
interface StyledTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

// __________COMPONENT FUNCTION & THEME SETUP____________________________________________
// Takes in props (label, error, extra styles) and fetches theme colors (light/dark mode).
export const StyledTextInput: React.FC<StyledTextInputProps> = ({ label, error, style, ...props }) => {
  const { colors } = useTheme();
  
  // ________WHAT GETS DISPLAYED ON SCREEN______________________________________________
  // Returns a box (View) containing:
  // - A label above the input (if provided)
  // - The text input box styled with dynamic theme colors (turns red on error)
  // - An error message below the input (if an error exists)
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

// ________STATIC STYLES______________________________________________
// Sets up fixed layout rules like spacing, padding, font sizes, and rounded corners.
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