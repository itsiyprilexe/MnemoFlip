import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthScreen } from '../components/AuthScreen';
import { palette } from '../theme';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <AuthScreen mode="login" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD

  safeArea: { flex: 1, backgroundColor: palette.background },
  
  page: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 12, paddingBottom: 30 },
=======
  safeArea: { 
    flex: 1, 
    backgroundColor: palette.background 
  },
  page: { 
    flexGrow: 1, 
    paddingHorizontal: 22, 
    paddingTop: 12, 
    paddingBottom: 30 
  },
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
});
