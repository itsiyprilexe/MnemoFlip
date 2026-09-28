import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

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
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          animation: 'slide_from_right',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
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
          options={{ title: 'Manage Deck' }}
        />
        <Stack.Screen
          name="Quiz"
          getComponent={lazyScreen(() => require('../screens/QuizScreen'), 'QuizScreen')}
          options={{ title: 'Quiz Mode', gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;