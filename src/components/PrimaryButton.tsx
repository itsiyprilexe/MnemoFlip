// ________IMPORTS______________________________________________
// Loads React, standard mobile button and text components, layout type definitions, and the app's theme settings.
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// ________Props Interface Definition______________________________________________
// Defines the rules for what data this button accepts: button text, press action, optional visual style variant, and custom style overrides.
interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// ________COMPONENT FUNCTION & THEME SETUP______________________________________________
// Function: PrimaryButton (Component)
// Renders a custom clickable button styled according to the chosen variant and app theme.
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
}) => {

  // ______________________________________________________
  // Function: useTheme
  // Retrieves the current color palette from the app's theme context.
  const { colors } = useTheme();
  
  // ______________________________________________________
  // Function: getBackgroundColor
  // Returns the correct background color based on the selected button variant (primary, secondary, or danger).
  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.muted;
      case 'danger':
        return colors.danger;
        case 'primary':
          default:
            return colors.primary;
          }
        };
        
  // ______________________________________________________
  // Function: TouchableOpacity (onPress)
  // Listens for user taps and triggers the provided `onPress` callback function.
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.button, { backgroundColor: getBackgroundColor() }, style]}
      onPress={onPress}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

// ________STYLES______________________________________________
// Function: StyleSheet.create
// Defines and optimizes the default visual styles (padding, borders, alignment, text size) for the button.
const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    flexDirection: 'row',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});