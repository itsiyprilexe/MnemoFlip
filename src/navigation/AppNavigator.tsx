import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Loads a screen lazily (at render time, not import time). This avoids circular-import
 * problems where a screen's export is still undefined while the navigator module loads.
 * Works with both named and default exports.
 */
const lazyScreen = (load: () => any, name: string) => () => {
  const mod = load();
  const component = mod?.[name] ?? mod?.default;
  if (!component) {
    throw new Error(`Screen "${name}" has no named or default export. Check its file.`);
  }
  return component as React.ComponentType<any>;
};

export const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="Onboarding"
              getComponent={lazyScreen(() => require('../screens/OnboardingScreen'), 'OnboardingScreen')}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Main"
              getComponent={lazyScreen(() => require('./MainTabs'), 'MainTabs')}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Deck"
              getComponent={lazyScreen(() => require('../screens/DeckScreen'), 'DeckScreen')}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddCards"
              getComponent={lazyScreen(() => require('../screens/AddCardsScreen'), 'AddCardsScreen')}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddCard"
              getComponent={lazyScreen(() => require('../screens/AddCardScreen'), 'AddCardScreen')}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ImportCards"
              getComponent={lazyScreen(() => require('../screens/ImportCardsScreen'), 'ImportCardsScreen')}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Study"
              getComponent={lazyScreen(() => require('../screens/StudyScreen'), 'StudyScreen')}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Quiz"
              getComponent={lazyScreen(() => require('../screens/QuizScreen'), 'QuizScreen')}
              options={{ title: 'Quiz Mode', gestureEnabled: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              getComponent={lazyScreen(() => require('../screens/LoginScreen'), 'LoginScreen')}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              getComponent={lazyScreen(() => require('../screens/SignUpScreen'), 'SignUpScreen')}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;