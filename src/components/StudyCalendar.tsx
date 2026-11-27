import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../theme';

const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function StudyCalendar() {
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
}


const styles = StyleSheet.create({
  calendar: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.line,
    overflow: 'hidden',
    marginBottom: 28,
  },

  header: {
    backgroundColor: '#315D48',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  subtitle: {
    fontSize: 11,
    color: '#D8E6DA',
    marginTop: 5,
  },

  navigation: {
    flexDirection: 'row',
    gap: 10,
  },

  arrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#47745B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 12,
  },

  cell: {
    width: `${100 / 7}%`,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  weekday: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: '700',
  },

  date: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateText: {
    color: '#294638',
    fontSize: 13,
  },

  today: {
    backgroundColor: '#315D48',
  },

  todayText: {
    color: '#fff',
    fontWeight: '700',
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: palette.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 14,
    marginTop: 10,
  },

  todayLabel: {
    flex: 1,
    color: '#294638',
    fontSize: 12,
  },

  todayButton: {
    backgroundColor: palette.greenLight,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 7,
  },

  todayButtonText: {
    color: palette.green,
    fontSize: 11,
    fontWeight: '700',
  },
});

