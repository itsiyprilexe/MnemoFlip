// _________Props interface_____________________________________________
// Explanation of the Props interface:
import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// _________StyledTextInput component_____________________________________________
// Explanation of the StyledTextInput component:          
// Explanation of the Props interface:
interface StyledTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

// ______________________________________________________
// Explanation of the Props interface:
export const StyledTextInput: React.FC<StyledTextInputProps> = ({ label, error, style, ...props }) => {
  const { colors } = useTheme();
  
  // ______________________________________________________
  // Explanation of the Props interface:
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
// Explanation of the Props interface:
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