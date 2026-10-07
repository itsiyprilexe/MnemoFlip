import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { palette } from '../theme';

export function SectionHeading({ title, note }: { title: string; note?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({

  row: { 
    flexDirection: 'row', 
    alignItems: 'baseline', 
    justifyContent: 'space-between', 
    marginBottom: 13 
  },

  title: { 
    color: palette.ink, 
    fontSize: 19, 
    letterSpacing: -0.5, 
    fontWeight: '700' 
  },

  note: { 
    color: palette.muted, 
    fontSize: 10 
  },
});
