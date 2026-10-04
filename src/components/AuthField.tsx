/**
 * Configures the core building blocks for a custom React Native input component:
 * - React & Hooks: Manages component lifecycle and interactive states (e.g., password visibility).
 * - React Native Primitives: Core UI layout elements, user input handling, and styling engine.
 * - Icons & Design Tokens: External visual iconography (Ionicons) and central theme constants 
 *   (colors, radius, spacing) to ensure UI consistency across the app.
 */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme'; 

// ______________________________________________________
// Explaination of the Props interface:
interface Props extends TextInputProps {
  label: string;
  secure?: boolean;
}

// ______________________________________________________
//Explaination of the AuthField component:
export const AuthField = ({ label, secure, style, ...rest }: Props) => {
  const [hidden, setHidden] = useState(!!secure);
  return (
    <View style={styles.wrap}>  
      <Text style={styles.label}>{label}</Text>
      <View style={styles.box}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.muted}
          secureTextEntry={hidden}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
          />
        {secure && (
          <TouchableOpacity onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.muted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ______________________________________________________
//Explanation of the default export:
export default AuthField;

// ______________________________________________________

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { fontSize: 14, fontWeight: '700', color: colors.heading, marginBottom: 6 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: colors.text },
});