import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { DeckProvider } from './src/context/DeckContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <DeckProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </DeckProvider>
    </SafeAreaProvider>
  );
}