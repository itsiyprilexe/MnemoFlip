import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreateItemForm } from '../components/CreateItemForm';
import { palette } from '../theme';

export default function AddQuizScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <CreateItemForm kind="quiz" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD

  safeArea: { flex: 1, backgroundColor: palette.background },
  
=======
  safeArea: { flex: 1, backgroundColor: palette.background },
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
  page: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 12, paddingBottom: 30 },
});
