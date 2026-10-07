import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Link, router } from 'expo-router';
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

  const continueToApp = () => router.replace('/home');

  return (
    <>
<<<<<<< HEAD

      <FormScreenHeader />
      <Text style={styles.eyebrow}>MNEMOFLIP ACCOUNT</Text>
      <Text style={styles.title}>{isSignUp ? 'Create your account' : 'Welcome back'}</Text>

      <Text style={styles.description}>
        {isSignUp ? 'A familiar place for your learning journey.' : 'Pick up where your curiosity left off.'}
      </Text>

      {isSignUp ? (
        <TextField 
          label="Name" 
          value={name} 
          onChangeText={setName} 
          placeholder="Your name" 
          autoCapitalize="words" 
          maxLength={60} 
          returnKeyType="next" />
      ) : null}

      <TextField 
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
        title={isSignUp ? 'Sign up' : 'Log in'} 
        onPress={continueToApp} 
        style={styles.submit} 
      />

      <Text style={styles.staticNote}>Continue to the app preview. No account details are saved.</Text>

      <Link href={isSignUp ? '/login' : '/signup'} asChild>

=======
      <FormScreenHeader />
      <Text style={styles.eyebrow}>MNEMOFLIP ACCOUNT</Text>
      <Text style={styles.title}>{isSignUp ? 'Create your account' : 'Welcome back'}</Text>
      <Text style={styles.description}>
        {isSignUp ? 'A familiar place for your learning journey.' : 'Pick up where your curiosity left off.'}
      </Text>
      {isSignUp ? (
        <TextField label="Name" value={name} onChangeText={setName} placeholder="Your name" autoCapitalize="words" maxLength={60} returnKeyType="next" />
      ) : null}
      <TextField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" autoComplete="email" maxLength={120} returnKeyType="next" />
      <TextField label="Password" value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry maxLength={80} returnKeyType="done" />
      <AppButton title={isSignUp ? 'Sign up' : 'Log in'} onPress={continueToApp} style={styles.submit} />
      <Text style={styles.staticNote}>Continue to the app preview. No account details are saved.</Text>
      <Link href={isSignUp ? '/login' : '/signup'} asChild>
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
        <Pressable accessibilityRole="link" style={styles.switchRow}>
          <Text style={styles.switchPrompt}>{isSignUp ? 'Already have an account?' : 'New to MnemoFlip?'}</Text>
          <Text style={styles.switchLink}>{isSignUp ? ' Log in' : ' Sign up'}</Text>
        </Pressable>
<<<<<<< HEAD

=======
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
      </Link>
    </>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD

  eyebrow: {textAlign: 'center', marginTop: 55, color: palette.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },

  title: { textAlign: 'center', color: palette.ink, fontSize: 28, fontWeight: '700', letterSpacing: -1},

  description: { textAlign: 'center', color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 7, marginBottom: 25 },

  submit: { marginTop: 6 },

  staticNote: { color: palette.muted, fontSize: 10, textAlign: 'center', marginTop: 14 },

  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 22, paddingVertical: 10 },

  switchPrompt: { color: palette.muted, fontSize: 12 },

=======
  eyebrow: {textAlign: 'center', marginTop: 55, color: palette.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },
  title: { textAlign: 'center', color: palette.ink, fontSize: 28, fontWeight: '700', letterSpacing: -1},
  description: { textAlign: 'center', color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 7, marginBottom: 25 },
  submit: { marginTop: 6 },
  staticNote: { color: palette.muted, fontSize: 10, textAlign: 'center', marginTop: 14 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 22, paddingVertical: 10 },
  switchPrompt: { color: palette.muted, fontSize: 12 },
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
  switchLink: { color: palette.green, fontSize: 12, fontWeight: '700' },
});
