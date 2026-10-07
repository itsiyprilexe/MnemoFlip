import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collections } from '../data/study';
import { palette } from '../theme';

const totalCards = collections.reduce((sum, collection) => sum + Number(collection.detail.match(/\d+/)?.[0] ?? 0), 0);

const stats = [
  { value: 
    String(collections.length), 
    label: 'STUDY SETS', 
    icon: 'albums-outline' as const, 
    tint: palette.lilac, 
    color: '#786798' 
  },

  { value: String(totalCards), 
    label: 'CARDS', 
    icon: 'bookmark-outline' as const, 
    tint: palette.peach, 
    color: '#A66F43' 
  }
  ,
  { value: '6.5h', 
    label: 'THIS WEEK',
    icon: 'time-outline' as const, 
    tint: palette.greenLight, 
    color: palette.green 
  },
];

export function StatsOverview() {
  return (
    <View style={styles.row}>
      {stats.map((stat) => (
        <View style={styles.card} key={stat.label}>
          <View style={[styles.icon, { backgroundColor: stat.tint }]}><Ionicons name={stat.icon} size={18} color={stat.color} /></View>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({

  row: { 
    flexDirection: 'row', 
    gap: 9 
  },

  card: { 
    flex: 1, 
    backgroundColor: palette.surface, 
    borderRadius: 18, 
    paddingHorizontal: 12, 
    paddingVertical: 13, 
    borderWidth: 1, 
    borderColor: palette.line 
  },

  icon: { 
    width: 31, 
    height: 31, 
    borderRadius: 11, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 11 
  },
  
  value: { 
    color: palette.ink, 
    fontSize: 19, 
    fontWeight: '700', 
    letterSpacing: -0.5 
  },

  label: { 
    color: palette.muted, 
    fontSize: 8, 
    fontWeight: '700', 
    letterSpacing: 0.7, 
    marginTop: 4 
  },
});
