import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
<<<<<<< HEAD
import {SafeAreaView} from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { AuthField } from '../components/AuthField';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../theme';
=======
import { NativeStackScreenProps } from '@react-navigation/native-stack'; // gin import niya ang content sa build in react
import { RootStackParamList } from '../types'; // gin import niya ang content sa types
import { PrimaryButton } from '../components/PrimaryButton'; // gin import niya ang content sa Primary Button
import { AuthField } from '../components/AuthField'; // gin import niya ang content sa Authfield
import { useAuth } from '../context/AuthContext'; // gin import niya ang content sa context
import { colors, spacing } from '../theme'; // gin import niya ang content sa theme
>>>>>>> refs/remotes/origin/main

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;


export const LoginScreen: React.FC<Props> = ({ navigation }) => {

  // pag set sa information ng user
  const { logIn } = useAuth(); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    if (!email.trim() || !password) return setError('Enter your email and password.');
    setBusy(true);
    setError('');
    const message = await logIn(email, password);
    if (message) {
      setError(message);
      setBusy(false);
    }
    // On success the navigator switches to the app automatically.
  };

  return ( // Display ang form para sa user input like email, user, password
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Log In</Text>
          <Text style={styles.subtitle}>Log in to your flashcards.</Text>

          <AuthField // Pag enter sa email
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoComplete="email"
          />
          <AuthField // Pag enter password
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secure
            onSubmitEditing={submit}
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <PrimaryButton title={busy ? 'Logging in...' : 'Log In'} onPress={submit} style={{ marginTop: spacing.sm }} />

{/* Buttons pakadto sa sign up */}
          <View style={styles.switchRow}> 
            <Text style={styles.switchText}>New here?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} hitSlop={10}>
              <Text style={styles.link}> Create an account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;      

const styles = StyleSheet.create({ // Style sa form (Pag log in)
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { padding: spacing.lg, paddingTop: spacing.xl },
  title: { fontSize: 50, fontWeight: '900', color: colors.heading, marginTop: 160, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.muted, marginTop: 6, marginBottom: spacing.lg, textAlign: 'center' },
  error: { color: '#DC2626', fontSize: 14, marginBottom: spacing.sm },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  switchText: { fontSize: 15, color: colors.muted },
  link: { fontSize: 15, fontWeight: '700', color: colors.primary },
});