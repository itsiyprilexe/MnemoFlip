import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../../theme';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: palette.green, tabBarInactiveTintColor: palette.muted, tabBarStyle: { backgroundColor: palette.surface } }}>
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({ size, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} color={focused ? palette.green : palette.muted} size={size} /> }} />
      <Tabs.Screen name="decks" options={{ title: 'Decks', tabBarIcon: ({ size, focused }) => <Ionicons name={focused ? 'albums' : 'albums-outline'} color={focused ? palette.green : palette.muted} size={size} /> }} />
      <Tabs.Screen name="quiz" options={{ title: 'Quizzes', tabBarIcon: ({ size, focused }) => <Ionicons name={focused ? 'help-circle' : 'help-circle-outline'} color={focused ? palette.green : palette.muted} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ size, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} color={focused ? palette.green : palette.muted} size={size} /> }} />
    </Tabs>
 
  );
}


