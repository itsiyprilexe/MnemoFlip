import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../theme';

type Props = { //gi lilist kun nano na information an need na ihatag sa "AppButton"
  title: string; // text label siya na makikita sa button pareho san "Log out"

  //an "onPress" function siya na gihihimo pag pipinduton an button.
  onPress: () => void; //an "void" ibigsabihin sana is dire need mag balik balik value

  //an "?" means optional
  style?: ViewStyle; //type san style na gi tatanggap
};

//naghihimo ngan nag-e-export san "AppButton" component para magamit sa iba nga file. 
// gikukuha niya an "title", "onPress", ngan "style" tikang sa props. 
// an "Props" kinahanglan sumunod ini sa rules na needs sa igbaw.
export function AppButton({ title, onPress, style }: Props) {
  return ( //nag e start ibalik or ipakita san component an button interface.
    
    // mga element na pwede pinduton
    <Pressable
      accessibilityRole="button" // na ngangaro permission sa accessibility tools na button ini
      onPress={onPress} //gihihimo an function na gihatag pag pipinduton
      style={[styles.button, style]} //ginagamit an una nga style san button ngan, kun may gihatag, gidugang an custom style
    >
      
      {/*gipapakita an title sa sulod san button gamit an "styles.label"*/}
      <Text style={styles.label}>{title}</Text> 

      {/*gipapakita an white na arrow na nakatutok sa right. Icon la siya, 
      dire siya an naghihimo san navigation. An "onPress" function san 
      "Pressable" an nag memean kun nano an nahihinabo pag gipindot an button.*/}
      <Ionicons 
      name="arrow-forward" 
      size={17} color="#FFFFFF"   
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({

  button: { 
    minHeight: 48, 
    borderRadius: 15, 
    backgroundColor: palette.green, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10, 
    paddingHorizontal: 18 
  },

  label: { 
    color: '#FFFFFF', 
    fontWeight: '700', 
    fontSize: 13 
  },
});
