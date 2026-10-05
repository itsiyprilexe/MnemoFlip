import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { AuthField } from '../components/AuthField';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../theme';

// Pag sign up
type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;
// Checker if email ang tinype
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Face of screen bago mag sign up
export const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const { signUp } = useAuth(); // Pag gawa ng account
  const [name, setName] = useState(''); // pag set ng name
  const [email, setEmail] = useState(''); // pag set ng email
  const [password, setPassword] = useState(''); // pag set ng password
  const [confirm, setConfirm] = useState(''); // pag confirm
  const [error, setError] = useState(''); // warning if may mali sa sign up
  const [busy, setBusy] = useState(false); // true = may ginagawa pa, hintayin muna


  const submit = async () => { // Mag rarun pag pinindot ang sign up
    if (busy) return; // if hindi mag proceed uulitin sa program

    // If may mali lalabas ang error warning 
    if (!name.trim()) return setError('Enter your name.'); 
    if (!EMAIL_RE.test(email.trim())) return setError('Enter a valid email address.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setBusy(true);
    setError('');
    const message = await signUp(name, email, password);
    if (message) {
      setError(message);
      setBusy(false);
    }
    // On success the navigator switches to the app automatically.
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Sign up to start making flashcards.</Text>

          <AuthField
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            autoCapitalize="words"
            autoComplete="name"
          />
          <AuthField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoComplete="email"
          />
          <AuthField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secure
          />
          <AuthField
            label="Confirm password"
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Repeat your password"
            secure
            onSubmitEditing={submit}
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <PrimaryButton
            title={busy ? 'Creating account...' : 'Sign Up'}
            onPress={submit}
            style={{ marginTop: spacing.sm }}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} hitSlop={10}>
              <Text style={styles.link}> Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { padding: spacing.lg, paddingTop: spacing.xl },
  title: { fontSize: 40, fontWeight: '900', color: colors.heading, marginTop: 100, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.muted, marginTop: 6, marginBottom: spacing.lg, textAlign: 'center' },
  error: { color: '#DC2626', fontSize: 14, marginBottom: spacing.sm },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  switchText: { fontSize: 15, color: colors.muted },
  link: { fontSize: 15, fontWeight: '700', color: colors.primary },
});