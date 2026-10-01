/* eslint-disable react-hooks/refs */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import DecksScreen from '../screens/DecksScreen';
import QuizPickerScreen from '../screens/QuizPickerScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useTheme } from '../context/ThemeContext';
import { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<keyof TabParamList, [string, string]> = {
  HomeTab: ['home', 'home-outline'],
  DecksTab: ['layers', 'layers-outline'],
  QuizTab: ['document-text', 'document-text-outline'],
  ProfileTab: ['person', 'person-outline'],
};

const BAR_HEIGHT = 64;
const H_MARGIN = 20;
const PADDING = 6;

const FloatingTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [innerWidth, setInnerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0));

  const tabWidth = innerWidth / state.routes.length;

  useEffect(() => {
    if (!tabWidth) return;
    Animated.spring(translateX.current, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
      mass: 0.8,
    }).start();
  }, [state.index, tabWidth]);

  const onInnerLayout = (e: LayoutChangeEvent) => setInnerWidth(e.nativeEvent.layout.width);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: Math.max(insets.bottom, 12) }]}
    >
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: '#000',
          },
        ]}
      >
        <View style={styles.inner} onLayout={onInnerLayout}>
          {/* Sliding active pill */}
          {tabWidth > 0 && (
            <Animated.View
              style={[
                styles.pill,
                {
                  width: tabWidth,
                  backgroundColor: colors.primary + '22',
                  transform: [{ translateX: translateX.current }],
                },
              ]}
            />
          )}

          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const focused = state.index === index;
            const label = (options.title ?? route.name) as string;
            const [active, inactive] = ICONS[route.name as keyof TabParamList];
            const color = focused ? colors.primary : colors.muted;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name as never);
              }
            };

            const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.item}
              >
                <Ionicons name={(focused ? active : inactive) as any} size={22} color={color} />
                <Text style={[styles.label, { color }]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export const MainTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerTitleStyle: { color: colors.heading, fontWeight: '800', fontSize: 22 },
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home', headerShown: false }} />
      <Tab.Screen name="DecksTab" component={DecksScreen} options={{ title: 'Decks', headerTitle: 'My Decks' }} />
      <Tab.Screen name="QuizTab" component={QuizPickerScreen} options={{ title: 'Quiz', headerTitle: 'Choose a Quiz' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile', headerTitle: 'Profile' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: H_MARGIN,
    right: H_MARGIN,
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    borderWidth: StyleSheet.hairlineWidth,
    padding: PADDING,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: { elevation: 10 },
    }),
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: (BAR_HEIGHT - PADDING * 2) / 2,
  },
  item: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
});

export default MainTabs;