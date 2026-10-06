import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

//importing the AppNavigator component, which manages the navigation between different screens in the app.
import { AppNavigator } from './src/navigation/AppNavigator';
//importing the AuthProvider, ThemeProvider, and StorageProvider components, which provide context for authentication, theme settings, and storage management respectively.
import { AuthProvider } from './src/context/AuthContext';
//importing the ThemeProvider component, which provides context for theme settings.
import { ThemeProvider } from './src/context/ThemeContext';
//importing the StorageProvider component, which provides context for storage management.
import { StorageProvider } from './src/context/StorageContext';

const AppContent = () => {
  return (
    <>
    {/* Controls the appearance of the device’s status bar (battery, time, signal).
          Here, it’s set to "dark" so icons/text appear dark. */}
      <StatusBar style="dark" />
      <AppNavigator />
    </>
  );
};

export default function App() {//dsplay all screen / load data or context sa database(StorageProvider)
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <StorageProvider>
            <AppContent />
          </StorageProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}