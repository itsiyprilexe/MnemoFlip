import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons'; //  Para sa mga icon
import { useRouter } from 'expo-router'; // Para makalipat o makabalik ng screen
import { palette } from '../theme'; // Mga kulay ng app

// Sa upper screen may arrow button (back button) at may nakasulat na MnemoFlip
export function FormScreenHeader() {
  const router = useRouter(); // Router pag pinindot ang arrow (back button) mababalik sa previous screen
  return (
    <View style={styles.row}>
<<<<<<< HEAD

      <Pressable 
        accessibilityRole="button" 
        accessibilityLabel="Go back" 
        onPress={() => router.back()} style={styles.back}
        >

        <Ionicons 
          name="arrow-back" 
          size={19} 
          color={palette.ink} 
        />
      </Pressable>

=======
      <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" size={19} color={palette.ink} />
      </Pressable>
<<<<<<< HEAD
      <Text style={styles.label}>Mnemo Flip</Text>
=======
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
      <Text style={styles.label}>MNEMOFLIP</Text>
>>>>>>> 3a6b5f868e5b000afeedd23212b2e057310467bb
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 13,
    marginBottom: 26 
  },
  back: { 
    width: 40, 
    height: 40, 
    borderRadius: 14, 
    backgroundColor: palette.surface, 
    borderWidth: 1, 
    borderColor: palette.line, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  label: { 
    color: palette.muted, 
    fontSize: 10, 
    letterSpacing: 1.4, 
    fontWeight: '800' 
  },
=======
<<<<<<< HEAD

  row: { flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 26 },

  back: { width: 40, height: 40, borderRadius: 14, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, alignItems: 'center', justifyContent: 'center' },
  
=======
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 26 },
  back: { width: 40, height: 40, borderRadius: 14, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, alignItems: 'center', justifyContent: 'center' },
>>>>>>> a9db2932fee6b8197ded6561fb8affac12a8f7da
  label: { color: palette.muted, fontSize: 10, letterSpacing: 1.4, fontWeight: '800' },
>>>>>>> 3a6b5f868e5b000afeedd23212b2e057310467bb
});
