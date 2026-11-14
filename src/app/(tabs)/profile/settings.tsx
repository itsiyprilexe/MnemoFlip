import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../../../contexts/AuthContext';
import { FormScreenHeader } from '../../../components/FormScreenHeader';
import { TextField } from '../../../components/TextField';
import { AppButton } from '../../../components/AppButton';
import { palette } from '../../../theme';
export default function Settings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName ?? '');
  const [busy, setBusy] = useState(false);
  useEffect(() => setName(user?.displayName ?? ''), [user?.uid]);
  const save = async () => {
    if (!user || busy) return;
    if (!name.trim()) { Alert.alert('Enter your name'); return; }
    setBusy(true);
    try { await updateProfile(user, { displayName: name.trim() }); Alert.alert('Saved', 'Your name has been updated.'); }
    catch (error) { Alert.alert('Could not update your profile', error instanceof Error ? error.message : 'Please try again.'); }
    finally { setBusy(false); }
  };
  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <FormScreenHeader fallbackHref="/profile" /><Text style={styles.title}>Account settings</Text>
    <TextField label="Name" value={name} onChangeText={setName} maxLength={60} />
    <Text style={styles.label}>Email</Text><Text style={styles.email}>{user?.email ?? 'Not available'}</Text>
    <AppButton title={busy ? 'Saving...' : 'Save name'} onPress={save} />
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: palette.background }, page: { padding: 22 }, title: { color: palette.ink, fontSize: 27, fontWeight: '700', marginBottom: 24 }, label: { color: palette.ink, fontWeight: '700' }, email: { color: palette.muted, marginVertical: 14 } });
