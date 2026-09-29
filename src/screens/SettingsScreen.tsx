import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme';

export const SettingsScreen: React.FC = () => {
  const { user, logOut } = useAuth();
  const { colors, isDark, setMode } = useTheme();

  const cardBg = isDark ? '#1E293B' : '#FFFFFF';

  const confirmLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => logOut() },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.heading }]}>Settings</Text>

        {user && (
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Ionicons name="person-circle-outline" size={40} color={colors.primary} />
            <View style={{ marginLeft: spacing.md }}>
              <Text style={[styles.name, { color: colors.heading }]}>{user.name}</Text>
              <Text style={{ color: colors.muted }}>{user.email}</Text>
            </View>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: cardBg, justifyContent: 'space-between' }]}>
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

        <TouchableOpacity style={[styles.card, { backgroundColor: cardBg }]} onPress={confirmLogout}>
          <Ionicons name="log-out-outline" size={22} color="#DC2626" />
          <Text style={[styles.label, { color: '#DC2626' }]}>Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  body: { padding: spacing.lg },
  title: { fontSize: 32, fontWeight: '800', marginBottom: spacing.lg },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginLeft: spacing.md },
  name: { fontSize: 17, fontWeight: '700' },
});