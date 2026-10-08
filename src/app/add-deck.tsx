import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreateItemForm } from '../components/CreateItemForm';
import { palette } from '../theme';

export default function AddDeckScreen() {
  return (//pag set sa kind = deck ngan ma route pakadto sa CreateItemForm
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <CreateItemForm kind="deck" />
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
