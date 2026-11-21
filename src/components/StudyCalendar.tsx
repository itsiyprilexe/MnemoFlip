import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../theme';

const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function StudyCalendar() {
<<<<<<< HEAD
  
  const [month, setMonth] = useState(() => { 
                            const now = new Date(); 
                            return new Date(now.getFullYear(), now.getMonth(), 1); 
                          });


  const now = new Date();

  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();

  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  const cells = Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) * 7 }, (_, i) => i - firstDay + 1);

  const shift = (amount: number) => setMonth(current => new Date(current.getFullYear(), current.getMonth() + amount, 1));

  return <View style={styles.calendar}>
    <View style={styles.header}><View style={styles.headerText}><Text style={styles.title}>{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</Text><Text style={styles.subtitle}>Make a little space for learning.</Text></View><View style={styles.navigation}>
      <Pressable accessibilityRole="button" accessibilityLabel="Previous month" onPress={() => shift(-1)} style={styles.arrow}><Ionicons name="chevron-back" size={18} color="#fff" /></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Next month" onPress={() => shift(1)} style={styles.arrow}><Ionicons name="chevron-forward" size={18} color="#fff" /></Pressable>
    </View>
    </View>
    
    <View style={styles.body}>
      <View style={styles.grid}>{weekdays.map((day, i) => <View style={styles.cell} key={`day-${i}`}>
                                                             <Text style={styles.weekday}>{day}</Text>
                                                          </View>)}
      {cells.map((day, i) => { const valid = day >= 1 && day <= daysInMonth; const today = valid && day === now.getDate() && month.getMonth() === now.getMonth() && month.getFullYear() === now.getFullYear(); return <View key={i} style={styles.cell}><View style={[styles.date, today && styles.today]}>{valid && <Text accessibilityLabel={`${month.toLocaleDateString(undefined, { month: 'long' })} ${day}, ${month.getFullYear()}${today ? ', today' : ''}`} style={[styles.dateText, today && styles.todayText]}>{day}</Text>}</View></View>; })}
    </View>
    
    <View style={styles.footer}>
      <Ionicons name="calendar-outline" size={16} color={palette.green} />
      <Text style={styles.todayLabel}>{now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Go to current month" onPress={() => setMonth(new Date(now.getFullYear(), now.getMonth(), 1))} style={styles.todayButton}>
        <Text style={styles.todayButtonText}>Today</Text>
        </Pressable>
      </View>
    </View>
  </View>;
=======
  // Start by displaying the current month.
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const today = new Date();
  const year = month.getFullYear();
  const monthNumber = month.getMonth();
  const firstDay = new Date(year, monthNumber, 1).getDay();
  const daysInMonth = new Date(year, monthNumber + 1, 0).getDate();

  // Include blank cells before the first day so the dates line up with the weekdays.
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const dates = Array.from({ length: totalCells }, (_, index) => index - firstDay + 1);

  const monthTitle = month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const todayLabel = today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  function changeMonth(amount: number) {
    setMonth(current => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  }

  function goToToday() {
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  function isToday(day: number) {
    return day === today.getDate()
      && monthNumber === today.getMonth()
      && year === today.getFullYear();
  }

  return (
    <View style={styles.calendar}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{monthTitle}</Text>
          <Text style={styles.subtitle}>Make a little space for learning.</Text>
        </View>
        <View style={styles.navigation}>
          <Pressable accessibilityRole="button" accessibilityLabel="Previous month" onPress={() => changeMonth(-1)} style={styles.arrow}>
            <Ionicons name="chevron-back" size={18} color="#fff" />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Next month" onPress={() => changeMonth(1)} style={styles.arrow}>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.grid}>
          {weekdays.map((day, index) => (
            <View style={styles.cell} key={`day-${index}`}>
              <Text style={styles.weekday}>{day}</Text>
            </View>
          ))}

          {dates.map((day, index) => {
            const validDate = day >= 1 && day <= daysInMonth;
            const highlightToday = validDate && isToday(day);
            const monthName = month.toLocaleDateString(undefined, { month: 'long' });
            const dateLabel = `${monthName} ${day}, ${year}${highlightToday ? ', today' : ''}`;

            return (
              <View key={index} style={styles.cell}>
                <View style={[styles.date, highlightToday && styles.today]}>
                  {validDate && (
                    <Text accessibilityLabel={dateLabel} style={[styles.dateText, highlightToday && styles.todayText]}>
                      {day}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Ionicons name="calendar-outline" size={16} color={palette.green} />
          <Text style={styles.todayLabel}>{todayLabel}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Go to current month" onPress={goToToday} style={styles.todayButton}>
            <Text style={styles.todayButtonText}>Today</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
>>>>>>> 1151abb9 (Update MnemoFlip)
}

const styles = StyleSheet.create({
  calendar: { backgroundColor: palette.surface, borderRadius: 20, borderWidth: 1, borderColor: palette.line, overflow: 'hidden', marginBottom: 24 },
  header: { backgroundColor: '#315D48', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 15 },
  headerText: { flex: 1 },
  title: { fontSize: 17, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 10, color: '#D8E6DA', marginTop: 3 },
  navigation: { flexDirection: 'row', gap: 7 },
  arrow: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#47745B', alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: 14, paddingBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingTop: 8 },
  cell: { width: `${100 / 7}%`, height: 36, alignItems: 'center', justifyContent: 'center' },
  weekday: { color: palette.muted, fontSize: 9, fontWeight: '700' },
  date: { width: 32, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dateText: { color: '#294638', fontSize: 12 },
  today: { backgroundColor: '#315D48' },
  todayText: { color: '#fff', fontWeight: '700' },
  footer: { borderTopWidth: 1, borderTopColor: palette.line, flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 10, marginTop: 8 },
  todayLabel: { flex: 1, color: '#294638', fontSize: 11 },
  todayButton: { backgroundColor: palette.greenLight, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 5 },
  todayButtonText: { color: palette.green, fontSize: 10, fontWeight: '700' },
});
