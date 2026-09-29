import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { DeckProvider } from './src/context/DeckContext';
import { QuizProvider } from './src/context/QuizContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

const AppContent = () => {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <DeckProvider>
            <QuizProvider>
              <AppContent />
            </QuizProvider>
          </DeckProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}