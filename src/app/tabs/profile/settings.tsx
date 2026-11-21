import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../../../contexts/AuthContext';
import { FormScreenHeader } from '../../../components/FormScreenHeader';
import { palette } from '../../../theme';
import { getStudyReminderEnabled, setStudyReminderEnabled } from '../../../services/studyReminders';
import { deleteAccount } from '../../../services/deleteAccount';
export default function Settings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName ?? '');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{
    message: string;
    error: boolean;
  } | null>(null);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderBusy, setReminderBusy] = useState(false);
  const [reminderError, setReminderError] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  useEffect(() => { setName(user?.displayName ?? ''); setNotice(null); }, [user?.uid]);
  const save = async () => {
    if(!user || busy)
      return;
    if(!name.trim()) {
      setNotice({ message: 'Please enter your name.', error: true });
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      await updateProfile(user, { displayName: name.trim() });
      setName(name.trim());
      setNotice({ message: 'Your name has been updated.', error: false });
    }
    catch(error) {
      setNotice({ message: error instanceof Error ? error.message : 'Could not update your profile. Please try again.', error: true });
    }
    finally {
      setBusy(false);
    }
  };
  useFocusEffect(useCallback(() => {
    let active = true;
    if(Platform.OS !== 'web')
      getStudyReminderEnabled().then(value => {
        if(active)
          setReminderEnabled(value);
      }).catch(() => {
        if(active)
          setReminderError('Could not check reminders on this device.');
      });
    return () => { active = false; };
  }, []));
  const changeReminder = async (enabled: boolean) => {
    if(reminderBusy)
      return;
    setReminderBusy(true);
    setReminderError('');
    try {
      await setStudyReminderEnabled(enabled);
      setReminderEnabled(enabled);
    }
    catch(error) {
      setReminderError(error instanceof Error ? error.message : 'Could not update reminders.');
    }
    finally {
      setReminderBusy(false);
    }
  };
  const removeAccount = async () => {
    if(!user || deleting)
      return;
    if(!password) {
      setDeleteError('Enter your password to continue.');
      return;
    }
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteAccount(user, password);
      setPassword('');
    }
    catch(error) {
      const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : '';
      setDeleteError(code === 'auth/invalid-credential' || code === 'auth/wrong-password' ? 'Incorrect password. Please try again.' : `Could not complete deletion. Some study data may already have been removed; please retry. ${error instanceof Error ? error.message : ''}`);
    }
    finally {
      setDeleting(false);
    }
  };
  return <SafeAreaView style={styles.safe} edges={['top']}>
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <FormScreenHeader fallbackHref="/profile" />

      <Text style={styles.eyebrow}>MADE IT YOURS</Text>
      <Text style={styles.title}>Account settings</Text>
      <Text style={styles.description}>Your details, preferences, and peace of mind.</Text>

      <View style={styles.card}>
        <View style={styles.cardHeading}>
          <View style={styles.headingIcon}>
            <Ionicons name="person-outline" size={20} color={palette.green} />
          </View>
          <View style={styles.headingText}>
            <Text style={styles.cardTitle}>Personal details</Text>
            <Text style={styles.cardSubtitle}>Your account information</Text>
          </View>
        </View>

        <Text style={styles.label}>Full name</Text>
        <TextInput accessibilityLabel="Full name" value={name} onChangeText={value => { setName(value); setNotice(null); }} placeholder="Enter your name" placeholderTextColor={palette.muted} autoCapitalize="words" maxLength={60} style={styles.input} />

        <Text style={styles.label}>Email address</Text>
        <View style={styles.emailBox}>
          <Text style={styles.email} selectable>{user?.email ?? 'Not available'}</Text>
          <Text style={styles.emailTag}>Account</Text>
        </View>

        {notice && <Text accessibilityLiveRegion="polite" style={[styles.notice, notice.error && styles.noticeError]}>{notice.message}</Text>}
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy || !user }} disabled={busy || !user} onPress={save} style={[styles.save, (busy || !user) && styles.disabled]}>
          <Text style={styles.saveText}>{busy ? 'Saving...' : 'Save changes'}</Text>
          <Ionicons name="checkmark" size={18} color="#fff" />
        </Pressable>

      </View>
      <Text style={styles.sectionTitle}>Study preferences</Text>
      <View style={styles.group}>
        <View style={[styles.groupRow, styles.rowDivider]}>
          <View style={styles.infoIcon}>
            <Ionicons name="notifications-outline" size={20} color={palette.green} />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Study reminders</Text>
            <Text style={styles.infoSubtitle}>{Platform.OS === 'web' ? 'Available on mobile devices' : 'Daily at 7:00 PM on this device'}</Text>{!!reminderError && <Text accessibilityLiveRegion="polite" style={styles.deleteError}>{reminderError}</Text>}
          </View>
          <Switch accessibilityLabel="Study reminders" value={reminderEnabled} disabled={reminderBusy || Platform.OS === 'web'} onValueChange={changeReminder} trackColor={{ false: '#D9E1D7', true: '#315D48' }} thumbColor="#FFFFFF" />
        </View>
        <View style={[styles.groupRow, styles.rowDivider]}>
          <View style={styles.infoIcon}>
            <Ionicons name="sunny-outline" size={20} color={palette.green} />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Appearance</Text>
          </View>
          <Text style={styles.rowValue}>Light</Text>
        </View>
        <View style={styles.groupRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="globe-outline" size={20} color={palette.green} />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Language</Text>
          </View>
          <Text style={styles.rowValue}>English</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Privacy &amp; data</Text>
      <View style={styles.group}>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: deleteOpen, disabled: deleting }} disabled={deleting} onPress={() => { setDeleteOpen(value => !value); setPassword(''); setDeleteError(''); }} style={styles.groupRow}>
          <View style={styles.deleteIcon}>
            <Ionicons name="trash-outline" size={20} color="#B84841" />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.deleteTitle}>Delete account</Text>
            <Text style={styles.infoSubtitle}>Permanently remove your account</Text>
          </View>
          <Ionicons name={deleteOpen ? 'chevron-up' : 'chevron-forward'} size={19} color="#B84841" />
        </Pressable>
        {deleteOpen && <View style={styles.deletePanel}>
          <Text style={styles.warning}>This permanently deletes your account, decks, flashcards, quizzes, and questions. This cannot be undone. Sign out on other devices before continuing.</Text>
          <Text style={styles.deleteLabel}>Confirm your password</Text>
          <TextInput accessibilityLabel="Confirm your password" value={password} onChangeText={setPassword} editable={!deleting} secureTextEntry autoCapitalize="none" autoCorrect={false} placeholder="Enter your password" placeholderTextColor={palette.muted} style={styles.input} />{deleteError ? <Text accessibilityLiveRegion="polite" style={styles.deleteError}>{deleteError}</Text> : null}<Pressable accessibilityRole="button" disabled={deleting} accessibilityState={{ disabled: deleting }} onPress={removeAccount} style={[styles.deleteButton, deleting && styles.disabled]}>
            <Text style={styles.saveText}>{deleting ? 'Deleting account...' : 'Permanently delete account'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" disabled={deleting} onPress={() => { setDeleteOpen(false); setPassword(''); setDeleteError(''); }} style={styles.cancelDelete}>
            <Text style={styles.infoTitle}>Cancel</Text>
          </Pressable>
        </View>}
      </View>
      <Text style={styles.sectionTitle}>A little help</Text>
      <View style={styles.group}>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: helpOpen }} onPress={() => setHelpOpen(value => !value)} style={[styles.groupRow, styles.rowDivider]}>
          <View style={styles.infoIcon}>
            <Ionicons name="help-circle-outline" size={20} color={palette.green} />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Help &amp; support</Text>{helpOpen && <Text style={styles.infoSubtitle}>Open a deck, tap a card to reveal its answer, and swipe to view another. Open a quiz to start answering its questions.</Text>}</View>
          <Ionicons name={helpOpen ? 'chevron-up' : 'chevron-forward'} size={19} color={palette.muted} />
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/profile/privacy')} style={styles.groupRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="document-text-outline" size={20} color={palette.green} />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Privacy &amp; terms</Text>
          </View>
          <Ionicons name="chevron-forward" size={19} color={palette.muted} />
        </Pressable>
      </View>
    </ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  exportPanel: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: palette.line
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    gap: 10,
    paddingHorizontal: 8
  },
  deletePanel: {
    borderTopWidth: 1,
    borderTopColor: palette.line,
    paddingTop: 14,
    paddingBottom: 12
  },
  warning: {
    color: '#84453E',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14
  },
  deleteLabel: {
    color: palette.ink,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 7
  },
  deleteError: {
    color: '#A64E46',
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 10
  },
  deleteButton: {
    minHeight: 48,
    borderRadius: 13,
    backgroundColor: '#A64E46',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12
  },
  cancelDelete: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44
  },
  group: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 20,
    paddingHorizontal: 14,
    marginTop: 12
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 66,
    paddingVertical: 12
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: palette.line
  },
  rowValue: {
    color: palette.muted,
    fontSize: 11
  },
  switchOff: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#D9E1D7',
    justifyContent: 'center',
    padding: 3
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF'
  },
  deleteIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: '#FFF1EF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteTitle: {
    color: '#B84841',
    fontSize: 12,
    fontWeight: '700'
  },
  safe: {
    flex: 1,
    backgroundColor: palette.background
  },
  page: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 120
  },
  eyebrow: {
    color: palette.muted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 9
  },
  title: {
    color: '#294638',
    fontSize: 27,
    fontWeight: '700',
    letterSpacing: -0.6
  },
  description: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 22
  },
  card: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 20,
    padding: 18
  },
  cardHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
    marginBottom: 17
  },
  headingIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: palette.greenLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headingText: {
    flex: 1
  },
  cardTitle: {
    color: '#294638',
    fontSize: 15,
    fontWeight: '700'
  },
  cardSubtitle: {
    color: palette.muted,
    fontSize: 10,
    marginTop: 3
  },
  label: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 7
  },
  input: {
    minHeight: 48,
    color: palette.ink,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.background,
    paddingHorizontal: 13,
    marginBottom: 16,
    fontSize: 13
  },
  emailBox: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 12,
    backgroundColor: palette.background,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  email: {
    flex: 1,
    color: '#294638',
    fontSize: 12
  },
  emailTag: {
    color: palette.green,
    fontSize: 10,
    fontWeight: '700'
  },
  notice: {
    color: palette.green,
    fontSize: 11,
    marginTop: 12
  },
  noticeError: {
    color: '#A64E46'
  },
  save: {
    minHeight: 48,
    backgroundColor: '#315D48',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 18
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13
  },
  disabled: {
    opacity: 0.5
  },
  sectionTitle: {
    color: '#294638',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 26
  },
  sectionDescription: {
    color: palette.muted,
    fontSize: 11,
    marginTop: 5,
    marginBottom: 12
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 15,
    padding: 14,
    marginBottom: 9
  },
  infoIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: palette.greenLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoText: {
    flex: 1
  },
  infoTitle: {
    color: '#294638',
    fontSize: 12,
    fontWeight: '700'
  },
  infoSubtitle: {
    color: palette.muted,
    fontSize: 11,
    marginTop: 4
  },
});
