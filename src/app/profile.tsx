import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { BrandHeader } from '../components/BrandHeader';
import { collections, quizzes } from '../data/study';
import { palette } from '../theme';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <BrandHeader />
<<<<<<< HEAD

        <Text style={styles.eyebrow}>YOUR SPACE</Text>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarLetter}>Y</Text></View>
          <Text style={styles.name}>Marc Cabili Gwapo</Text>
          <Text style={styles.subtitle}>Computer Science Student</Text>
          <Text style={styles.memberSince}>Building things that dont exist yet 404: still figuring it out.</Text>
        </View>

        <Text style={styles.sectionTitle}>Your learning space</Text>

=======
        <Text style={styles.eyebrow}>YOUR SPACE</Text>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarLetter}>Y</Text></View>
          <Text style={styles.name}>Yuri Gwapo</Text>
          <Text style={styles.subtitle}>Computer Science Student</Text>
          <Text style={styles.memberSince}>Making room for new ideas, one day at a time.</Text>
        </View>
        <Text style={styles.sectionTitle}>Your learning space</Text>
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <View style={styles.statIcon}><Ionicons name="albums-outline" size={18} color={palette.green} /></View>
            <Text style={styles.statLabel}>Study decks</Text>
            <Text style={styles.statValue}>{collections.length}</Text>
          </View>
<<<<<<< HEAD

=======
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <View style={styles.statIcon}><Ionicons name="help-circle-outline" size={18} color="#786798" /></View>
            <Text style={styles.statLabel}>Quizzes</Text>
            <Text style={styles.statValue}>{quizzes.length}</Text>
          </View>
        </View>
<<<<<<< HEAD
        
        <AppButton 
          title="Account settings" 
          onPress={() => Alert.alert('Under construction', 'Profile settings are coming soon.')} 
          style={styles.button} 
        />

=======
        <AppButton title="Account settings" onPress={() => Alert.alert('Under construction', 'Profile settings are coming soon.')} style={styles.button} />
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
        <AppButton
          title="Log out"
          onPress={() => router.replace('/')}
          style={styles.logoutButton}
        />
<<<<<<< HEAD

=======
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
        <Text style={styles.note}>This is a sample profile. No personal data is saved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
<<<<<<< HEAD

  page: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 126 },

  eyebrow: { fontSize: 10, color: palette.muted, letterSpacing: 1.5, fontWeight: '700', marginBottom: 10 },

  title: { fontSize: 29, lineHeight: 35, fontWeight: '700', letterSpacing: -1, color: palette.ink, marginBottom: 20 },

  profileCard: { backgroundColor: palette.surface, alignItems: 'center', borderRadius: 22, padding: 22, borderWidth: 1, borderColor: palette.line, marginBottom: 26 },

  avatar: { width: 74, height: 74, borderRadius: 37, backgroundColor: palette.greenLight, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },

  avatarLetter: { color: palette.green, fontSize: 26, fontWeight: '700' },

  name: { color: palette.ink, fontSize: 18, fontWeight: '700' },

  subtitle: { color: palette.green, fontSize: 11, fontWeight: '700', marginTop: 5 },

  memberSince: { color: palette.muted, fontSize: 11, textAlign: 'center', lineHeight: 17, marginTop: 12 },

  sectionTitle: { color: palette.ink, fontSize: 17, fontWeight: '700', marginBottom: 12 },

  statsCard: { backgroundColor: palette.surface, borderRadius: 18, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 15, marginBottom: 20 },

  statRow: { minHeight: 57, flexDirection: 'row', alignItems: 'center' },

  statIcon: { width: 33, height: 33, borderRadius: 11, backgroundColor: palette.greenLight, alignItems: 'center', justifyContent: 'center', marginRight: 11 },

  statLabel: { flex: 1, color: palette.ink, fontSize: 12, fontWeight: '600' },

  statValue: { color: palette.green, fontSize: 13, fontWeight: '700' },

  divider: { height: StyleSheet.hairlineWidth, backgroundColor: palette.line },

  button: { marginBottom: 15 },

  logoutButton: { backgroundColor: '#A64E46', marginBottom: 15 },
  
=======
  page: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 126 },
  eyebrow: { fontSize: 10, color: palette.muted, letterSpacing: 1.5, fontWeight: '700', marginBottom: 10 },
  title: { fontSize: 29, lineHeight: 35, fontWeight: '700', letterSpacing: -1, color: palette.ink, marginBottom: 20 },
  profileCard: { backgroundColor: palette.surface, alignItems: 'center', borderRadius: 22, padding: 22, borderWidth: 1, borderColor: palette.line, marginBottom: 26 },
  avatar: { width: 74, height: 74, borderRadius: 37, backgroundColor: palette.greenLight, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarLetter: { color: palette.green, fontSize: 26, fontWeight: '700' },
  name: { color: palette.ink, fontSize: 18, fontWeight: '700' },
  subtitle: { color: palette.green, fontSize: 11, fontWeight: '700', marginTop: 5 },
  memberSince: { color: palette.muted, fontSize: 11, textAlign: 'center', lineHeight: 17, marginTop: 12 },
  sectionTitle: { color: palette.ink, fontSize: 17, fontWeight: '700', marginBottom: 12 },
  statsCard: { backgroundColor: palette.surface, borderRadius: 18, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 15, marginBottom: 20 },
  statRow: { minHeight: 57, flexDirection: 'row', alignItems: 'center' },
  statIcon: { width: 33, height: 33, borderRadius: 11, backgroundColor: palette.greenLight, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  statLabel: { flex: 1, color: palette.ink, fontSize: 12, fontWeight: '600' },
  statValue: { color: palette.green, fontSize: 13, fontWeight: '700' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: palette.line },
  button: { marginBottom: 15 },
  logoutButton: { backgroundColor: '#A64E46', marginBottom: 15 },
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
  note: { color: palette.muted, textAlign: 'center', fontSize: 10 },
});
