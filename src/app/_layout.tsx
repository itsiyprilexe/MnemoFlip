import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomNavigation } from '../components/BottomNavigation';
import { palette } from '../theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: palette.background }}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: 'none', contentStyle: { backgroundColor: palette.background } }} />
        <BottomNavigation />
      </View>
    </SafeAreaProvider>
  );
}
