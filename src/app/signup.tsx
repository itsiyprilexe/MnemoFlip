import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthScreen } from '../components/AuthScreen';
import { palette } from '../theme';

export default function SignupScreen() {
  return (
    //para sa pag set value sa mode = signup ngan rout pakadto sa AuthScreen
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <AuthScreen mode="signup" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

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
});
