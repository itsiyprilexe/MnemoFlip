import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { week } from '../data/study';
import { palette } from '../theme';

export function WeeklyRhythm() {
  return (
    <View style={stylesweek.card}>

      <View/>
      <View style={stylesweek.heading}>
        <View style={stylesweek.labelWrap}>
          <View/>
          <Text style={stylesweek.label}>YOUR WEEKLY RHYTHM</Text>
        </View>
      </View>

      <View style={stylesweek.metrics}>

        <View>
          <Text style={stylesweek.number}>4<Text style={stylesweek.unit}> days</Text></Text>
          <Text style={stylesweek.caption}>You’re building a lovely habit.</Text>
        </View>

        <View style={stylesweek.streak}>
          <Text style={stylesweek.streakText}>4 day streak</Text>
        </View>

      </View>

      <View style={stylesweek.weekRow}>
        {week.map((item, index) => (
          
          <View style={stylesweek.weekItem} key={`${item.day}-${index}`}>
              {/* para sa check ngan an highlight na gold circle */}
            <View style={[stylesweek.weekDot, item.done && stylesweek.weekDotDone, index === 3 && stylesweek.weekDotToday]}>
              {item.done ? <Ionicons name="checkmark" size={14} color={palette.green} /> : null}
            </View>
              {/* para sa check ngan an highlight na gold circle */}
            <Text style={[stylesweek.weekDay, index === 3 && stylesweek.weekDayToday]}>{item.day}</Text>
          </View>

        ))}
      </View>
    </View>
  );
}

const stylesweek = StyleSheet.create({
  card: { 
    overflow: 'hidden', 
    backgroundColor: '#405F47', 
    borderRadius: 24, 
    padding: 20 
  },

  heading: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },

  labelWrap: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 7 
  },
  
  label: { 
    fontSize: 9, 
    letterSpacing: 1.2, 
    fontWeight: '700', 
    color: '#DCE4D8' 
  },

  metrics: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginTop: 22, 
    marginBottom: 20 
  },

  number: { 
    fontSize: 34, 
    fontWeight: '700', 
    color: '#FFFFFF', 
    letterSpacing: -1 
  },

  unit: { 
    fontSize: 17, 
    fontWeight: '500', 
    color: '#E3E8DE', 
    letterSpacing: 0 
  },

  caption: { 
    fontSize: 11, 
    color: '#DCE4D8', 
    marginTop: 3 
  },

  streak: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    backgroundColor: '#FFFFFF18', 
    paddingHorizontal: 10, 
    paddingVertical: 8, 
    borderRadius: 14 },

  streakText: { 
    color: '#FFFFFF', 
    fontSize: 10, 
    fontWeight: '700' 
  },

  weekRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingTop: 15, 
    borderTopWidth: StyleSheet.hairlineWidth, 
    borderTopColor: '#FFFFFF38' 
  },

  weekItem: { 
    alignItems: 'center', 
    gap: 7 
  },

  weekDot: { 
    width: 27, 
    height: 27, 
    borderRadius: 14, 
    borderWidth: 1, 
    borderColor: '#A4B3A3', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  weekDotDone: { 
    backgroundColor: '#E4EBDD', 
    borderColor: '#E4EBDD' 
  },

  weekDotToday: { 
    borderColor: '#E8C579', 
    borderWidth: 1.5 
  },

  weekDay: { 
    fontSize: 9, 
    color: '#CFD8CD', 
    fontWeight: '600' 
  },

  weekDayToday: { 
    color: '#F1D28E' 
  },
});
