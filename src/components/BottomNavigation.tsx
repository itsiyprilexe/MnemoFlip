import React from 'react';
import { Link, usePathname } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../theme';

const tabs = [
  { label: 'Home', 
    href: '/home', 
    icon: 'home-outline' as const, 
    activeIcon: 'home' as const 
  }
  ,
  { label: 'Decks', 
    href: '/collections', 
    icon: 'albums-outline' as const, 
    activeIcon: 'albums' as const 
  },

  { label: 'Quizzes', 
    href: '/quizzes', 
    icon: 'help-circle-outline' as const, 
    activeIcon: 'help-circle' as const 
  },

  { label: 'Profile', 
    href: '/profile', 
    icon: 'person-outline' as const, 
    activeIcon: 'person' as const 
  },
];

export function BottomNavigation() {
  const pathname = usePathname();
  if (pathname === '/' || pathname === '/add-deck' || pathname === '/add-quiz' || pathname === '/login' || pathname === '/signup') return null;

  return (
    <SafeAreaView edges={['bottom']} pointerEvents="box-none" style={styles.safeArea}>

      <View style={styles.bar}>
        {tabs.map((tab) => {
          const active = pathname === tab.href || (tab.href === '/collections' && pathname.startsWith('/deck/'));
          return (

            <Link key={tab.href} href={tab.href as '/home' | '/collections' | '/quizzes' | '/profile'} asChild>
              <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} style={styles.item}>
                <Ionicons name={active ? tab.activeIcon : tab.icon} size={20} color={active ? palette.green : palette.muted} />
                <Text style={[styles.label, active && styles.activeLabel]}>{tab.label}</Text>
              </Pressable>
            </Link>
            
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { position: 'absolute', left: 16, right: 16, bottom: 4, zIndex: 10, backgroundColor: 'transparent' },

  bar: {
    minHeight: 64,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderRadius: 23,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
    ...Platform.select({
      ios: { shadowColor: '#29362B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.14, shadowRadius: 16 },
      android: { elevation: 12 },
      default: {},
    }),
  },

  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, minHeight: 56 },

  label: { color: palette.muted, fontSize: 8, fontWeight: '600' },
  
  activeLabel: { color: palette.green, fontWeight: '800' },
});
