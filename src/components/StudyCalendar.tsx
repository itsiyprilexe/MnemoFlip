import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../theme';

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export function StudyCalendar() {
  const [month, setMonth] = useState(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), 1); });
  const now = new Date();
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) * 7 }, (_, i) => i - firstDay + 1);
  const shift = (amount: number) => setMonth(current => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  return <View style={styles.calendar}>
    <View style={styles.header}><Text style={styles.title}>{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</Text><View style={styles.navigation}>
      <Pressable accessibilityRole="button" accessibilityLabel="Previous month" onPress={() => shift(-1)} style={styles.arrow}><Ionicons name="chevron-back" size={19} color={palette.green} /></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Next month" onPress={() => shift(1)} style={styles.arrow}><Ionicons name="chevron-forward" size={19} color={palette.green} /></Pressable>
    </View></View>
    <View style={styles.grid}>{weekdays.map((day, i) => <View style={styles.cell} key={`day-${i}`}><Text style={styles.weekday}>{day}</Text></View>)}
      {cells.map((day, i) => { const valid = day >= 1 && day <= daysInMonth; const today = valid && day === now.getDate() && month.getMonth() === now.getMonth() && month.getFullYear() === now.getFullYear(); return <View key={i} style={styles.cell}><View style={[styles.date, today && styles.today]}>{valid && <Text accessibilityLabel={`${month.toLocaleDateString(undefined, { month: 'long' })} ${day}, ${month.getFullYear()}${today ? ', today' : ''}`} style={[styles.dateText, today && styles.todayText]}>{day}</Text>}</View></View>; })}
    </View>
  </View>;
}
const styles = StyleSheet.create({ calendar: { backgroundColor: palette.surface, borderRadius: 20, borderWidth: 1, borderColor: palette.line, padding: 15, marginBottom: 24 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }, title: { fontSize: 15, fontWeight: '700', color: palette.ink }, navigation: { flexDirection: 'row' }, arrow: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }, grid: { flexDirection: 'row', flexWrap: 'wrap' }, cell: { width: `${100 / 7}%`, height: 35, alignItems: 'center', justifyContent: 'center' }, weekday: { color: palette.muted, fontSize: 11, fontWeight: '700' }, date: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }, dateText: { color: palette.ink, fontSize: 12 }, today: { backgroundColor: palette.green }, todayText: { color: '#fff', fontWeight: '700' } });
