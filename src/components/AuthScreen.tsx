import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
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
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [busy, setBusy] = useState(false);

  const continueToApp = async () => {
    if (busy) return;
    const nextErrors: typeof errors = {};
    const cleanEmail = email.trim();
    if (isSignUp && !name.trim()) nextErrors.name = 'Please enter your name.';
    if (!cleanEmail) nextErrors.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      nextErrors.email = 'Please enter a valid email address, such as name@example.com.';
    }
    if (!password) nextErrors.password = 'Please enter your password.';
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setBusy(true);
    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        try {
          await updateProfile(result.user, { displayName: name.trim() });
        } catch {
          Alert.alert('Account created', 'Your account was created, but your name could not be saved.');
        }
      } else {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      }
    } catch (error) {
      const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : '';
      const message =
        code === 'auth/email-already-in-use'
          ? 'An account with this email already exists. Please log in.'
          : code === 'auth/invalid-email'
            ? 'Please enter a valid email address.'
            : code === 'auth/weak-password'
              ? 'Please choose a stronger password.'
              : code === 'auth/user-not-found'
                ? 'No account was found for this email. Please sign up.'
                : code === 'auth/invalid-credential' || code === 'auth/wrong-password'
                  ? 'Incorrect email or password. Please try again, or sign up if you do not have an account.'
                  : error instanceof Error
                    ? error.message
                    : 'Please try again.';
      setErrors({ form: message });
      if (!isSignUp && Platform.OS !== 'web') {
        Alert.alert('Unable to log in', message);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <FormScreenHeader fallbackHref="/" />
      <Text style={styles.eyebrow}>MNEMOFLIP ACCOUNT</Text>
      <Text style={styles.title}>{isSignUp ? 'Create your account' : 'Welcome back'}</Text>

      <Text style={styles.description}>
        {isSignUp ? 'A familiar place for your learning journey.' : 'Pick up where your curiosity left off.'}
      </Text>

      {isSignUp ? (
        <TextField
          label="Name"
          value={name}
          onChangeText={value => {
            setName(value);
            setErrors(current => ({ ...current, name: undefined, form: undefined }));
          }}
          error={errors.name}
          placeholder="Your name"
          autoCapitalize="words"
          maxLength={60}
          returnKeyType="next"
        />
      ) : null}

      <TextField
        label="Email"
        value={email}
        onChangeText={value => {
          setEmail(value);
          setErrors(current => ({ ...current, email: undefined, form: undefined }));
        }}
        error={errors.email}
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
        onChangeText={value => {
          setPassword(value);
          setErrors(current => ({ ...current, password: undefined, form: undefined }));
        }}
        error={errors.password}
        placeholder="Enter your password"
        secureTextEntry
        maxLength={80}
        returnKeyType="done"
      />

      {!!errors.form && (
        <Text accessibilityRole="alert" style={styles.error}>
          {errors.form}
        </Text>
      )}
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
  eyebrow: {
    textAlign: 'center',
    marginTop: 55,
    color: palette.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    color: palette.ink,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -1,
  },
  description: {
    textAlign: 'center',
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
    marginBottom: 25,
  },
  submit: { marginTop: 6 },
  error: { color: '#A64E46', fontSize: 12, marginBottom: 8, lineHeight: 18 },
  staticNote: { color: palette.muted, fontSize: 10, textAlign: 'center', marginTop: 14 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 22, paddingVertical: 10 },
  switchPrompt: { color: palette.muted, fontSize: 12 },
  switchLink: { color: palette.green, fontSize: 12, fontWeight: '700' },
});
