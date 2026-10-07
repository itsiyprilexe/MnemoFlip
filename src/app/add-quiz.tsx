import React from 'react';

//ScrollView (a container you can scroll) and StyleSheet (where you write styles).
import { ScrollView, StyleSheet } from 'react-native';

//box that automatically stays clear of the notch and status bar at the top.
import { SafeAreaView } from 'react-native-safe-area-context';

//Two files the form component, and your color list.
import { CreateItemForm } from '../components/CreateItemForm';
import { palette } from '../theme';

//screen itself. export default is what makes Expo Router treat this file as the /add-quiz page.
export default function AddQuizScreen() {

  //outer box. Fills the screen and paints it off-white. edges={['top']} = only avoid the top notch, not the bottom.
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <CreateItemForm kind="quiz" />
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
