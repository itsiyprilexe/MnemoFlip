import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../services/firebase';
import { AppButton } from './AppButton';
import { FormScreenHeader } from './FormScreenHeader';
import { TextField } from './TextField';
import { palette } from '../theme';

type Props = { mode: 'login' | 'signup' };

export function AuthScreen({ mode }: Props) {
  const isSignUp = mode === 'signup';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [busy, setBusy] = useState(false);
  const continueToApp = async () => {
    if (busy) return;
    if (!email.trim() || !password || (isSignUp && !name.trim())) {
      Alert.alert('Missing information', 'Please fill in all fields.'); return;
    }
    setBusy(true);
    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
        try { await updateProfile(result.user, { displayName: name.trim() }); }
        catch { Alert.alert('Account created', 'Your account was created, but your name could not be saved.'); }
      } else await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : '';
      const message = code === 'auth/email-already-in-use' ? 'An account with this email already exists. Please log in.' : error instanceof Error ? error.message : 'Please try again.';
      Alert.alert('Unable to continue', message);
    } finally { setBusy(false); }
  };

  return (
    <>

      <FormScreenHeader fallbackHref="/" />
      <Text style={styles.eyebrow}>MNEMOFLIP ACCOUNT</Text>
      <Text style={styles.title}>{isSignUp ? 'Create your account' : 'Welcome back'}</Text>

      <Text style={styles.description}>
        {isSignUp ? 'A familiar place for your learning journey.' : 'Pick up where your curiosity left off.'}
      </Text>

      {isSignUp ? (// gin display if isSignUp = signup
        <TextField 
          label="Name" 
          value={name} 
          onChangeText={setName} 
          placeholder="Your name" 
          autoCapitalize="words" 
          maxLength={60} 
          returnKeyType="next" />
      ) : null}

      <TextField //para sa user input ngan display an data san user input 
        label="Email" 
        value={email} 
        onChangeText={setEmail} 
        placeholder="Email" 
        autoCapitalize="none" 
        keyboardType="email-address" 
        autoComplete="email" 
        maxLength={120} 
        returnKeyType="next" 
      />

      <TextField 
        label="Password" 
        value={password} 
        onChangeText={setPassword} 
        placeholder="Enter your password" 
        secureTextEntry 
        maxLength={80} 
        returnKeyType="done" 
      />

      <AppButton 
        title={busy ? 'Please wait...' : isSignUp ? 'Sign up' : 'Log in'} 
        onPress={continueToApp} 
        style={styles.submit} 
      />

      <Text style={styles.staticNote}>Sign in to keep your learning space available across devices.</Text>

      <Link href={isSignUp ? '/login' : '/signup'} asChild>

        <Pressable accessibilityRole="link" style={styles.switchRow}>
          <Text style={styles.switchPrompt}>{isSignUp ? 'Already have an account?' : 'New to MnemoFlip?'}</Text>
          <Text style={styles.switchLink}>{isSignUp ? ' Log in' : ' Sign up'}</Text>
        </Pressable>
      </Link>
    </>
  );
}

const styles = StyleSheet.create({

  eyebrow: {textAlign: 'center', marginTop: 55, color: palette.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },

  title: { textAlign: 'center', color: palette.ink, fontSize: 28, fontWeight: '700', letterSpacing: -1},

  description: { textAlign: 'center', color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 7, marginBottom: 25 },

  submit: { marginTop: 6 },

  staticNote: { color: palette.muted, fontSize: 10, textAlign: 'center', marginTop: 14 },

  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 22, paddingVertical: 10 },

  switchPrompt: { color: palette.muted, fontSize: 12 },

  switchLink: { color: palette.green, fontSize: 12, fontWeight: '700' },
});
