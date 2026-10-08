import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { StudyCollection } from '../data/study';
import { palette } from '../theme';

export function CollectionCard({ collection, index }: { collection: StudyCollection; index: number }) {
  return (
    // asya ine an button if gin click mo reading visual art e rout.push ka sa [id].tsx tikang an data sa Study.ts
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${collection.title}, ${collection.detail}`}
      onPress={() => router.push(`/deck/${collection.id}`)}
      style={styles.card}
    >

      {/* an pag display san icons san mga subject sa home, deck section  */}
      <View style={[styles.icon, { backgroundColor: collection.tint }]}>

        <Ionicons 
          name={collection.icon} 
          size={22} 
          color={collection.color} 
        /> 
      </View>

      <View style={styles.text}>
        <Text style={styles.title}>{collection.title}</Text>
        <Text style={styles.detail}>{collection.detail}</Text>
      </View>

      <View style={styles.trailing}>
        <View 
          style={styles.count}><Text 
          style={styles.countText}>{String(index + 1).padStart(2, '0')}</Text>
        </View>

        <Ionicons 
          name="chevron-forward" 
          size={16} 
          color={palette.muted} 
        />
      </View>
      
    </Pressable>
  );
}

const styles = StyleSheet.create({

  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: palette.surface, 
    borderRadius: 17, 
    borderWidth: 1, 
    borderColor: palette.line, 
    padding: 12, 
    marginBottom: 9 
  },

  icon: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  text: { 
    flex: 1, 
    marginLeft: 12 
  },

  title: { 
    color: palette.ink, 
    fontSize: 14, 
    fontWeight: '700' 
  },

  detail: { color: palette.muted, fontSize: 10, marginTop: 4 },

  count: { width: 29, height: 29, borderRadius: 10, backgroundColor: palette.background, alignItems: 'center', justifyContent: 'center' },

  trailing: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  countText: { color: palette.muted, fontSize: 9, fontWeight: '700' },
});
