import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import DecksScreen from '../screens/DecksScreen';
import QuizPickerScreen from '../screens/QuizPickerScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useTheme } from '../context/ThemeContext';
import { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<keyof TabParamList, [string, string]> = {
  HomeTab: ['home', 'home-outline'],
  DecksTab: ['layers', 'layers-outline'],
  QuizTab: ['document-text', 'document-text-outline'],
  ProfileTab: ['person', 'person-outline'],
  SettingsTab: ['settings', 'settings-outline'],
};

export const MainTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={(focused ? ICONS[route.name][0] : ICONS[route.name][1]) as any}
            size={size}
            color={color}
          />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 66,
          paddingTop: 8,
          paddingBottom: 8,
        },
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerTitleStyle: { color: colors.heading, fontWeight: '800', fontSize: 22 },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home', headerShown: false }} />
      <Tab.Screen name="DecksTab" component={DecksScreen} options={{ title: 'Decks', headerTitle: 'My Decks' }} />
      <Tab.Screen name="QuizTab" component={QuizPickerScreen} options={{ title: 'Quiz', headerTitle: 'Choose a Quiz' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile', headerTitle: 'Profile' }} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} options={{ title: 'Settings', headerShown: false }} />
    </Tab.Navigator>
  );
};

export default MainTabs;