import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme';

export const SettingsSection: React.FC = () => {
  const { logOut } = useAuth();
  const { colors, isDark, setMode } = useTheme();

  const confirmLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => logOut() },
    ]);
  };

  return (
    <View>
      <Text style={[styles.heading, { color: colors.muted }]}>SETTINGS</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.row}>
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={colors.primary} />
          <Text style={[styles.label, { color: colors.heading }]}>
            {isDark ? 'Dark mode' : 'Light mode'}
          </Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={(on) => setMode(on ? 'dark' : 'light')}
          trackColor={{ true: colors.primary }}
        />
      </View>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={confirmLogout}
      >
        <View style={styles.row}>
          <Ionicons name="log-out-outline" size={22} color="#DC2626" />
          <Text style={[styles.label, { color: '#DC2626' }]}>Log out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsSection;

const styles = StyleSheet.create({
  heading: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginLeft: spacing.md },
});