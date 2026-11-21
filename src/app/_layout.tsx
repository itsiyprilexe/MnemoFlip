import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { palette } from '../theme';
import { cancelPreviousStudyReminder } from '../services/studyReminders';

function Navigation() {
  const { user, loading } = useAuth();
  if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" /></View>;
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.background } }}>
    
    <Stack.Screen name="index" />
<<<<<<< HEAD
    
=======

>>>>>>> 1151abb9 (Update MnemoFlip)
    <Stack.Protected guard={!!user}>
      <Stack.Screen name="(tabs)" />
    </Stack.Protected>

    <Stack.Protected guard={!user}>
      <Stack.Screen name="login" />
<<<<<<< HEAD
    <Stack.Screen name="signup" />
    </Stack.Protected>
  </Stack>;
=======
      <Stack.Screen name="signup" />
    </Stack.Protected>

    </Stack>;
>>>>>>> 1151abb9 (Update MnemoFlip)
}
export default function RootLayout() {
  useEffect(() => { cancelPreviousStudyReminder().catch(() => { }); }, []);
  return <SafeAreaProvider>
          <StatusBar style="dark" />
          <AuthProvider>
            <Navigation />
          </AuthProvider>
        </SafeAreaProvider>;
}
