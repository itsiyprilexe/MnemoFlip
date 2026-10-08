import React, { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { AppButton } from './AppButton';
import { FormScreenHeader } from './FormScreenHeader';
import { TextField } from './TextField';
import { palette } from '../theme';

type Props = { kind: 'deck' | 'quiz' };// ig set an value depende sa user kun galing siya sa deck or quiz

export function CreateItemForm({ kind }: Props) {
  const [title, setTitle] = useState('');//para sa user input 
  const [description, setDescription] = useState('');


  const itemName = kind === 'deck' ? 'deck' : 'quiz'; // para sa pag display if deck or quiz
  const pluralName = kind === 'deck' ? 'decks' : 'quizzes';
  const titleLabel = kind === 'deck' ? 'Deck name' : 'Quiz name';
  const titlePlaceholder = kind === 'deck' ? 'e.g. Human anatomy' : 'e.g. Cell biology basics';
  const buttonLabel = kind === 'deck' ? 'Add deck' : 'Add quiz';

  const showPreviewMessage = () => { //an para sa onPress iya ig print an Alert()
    Alert.alert(
      'Static preview',
      `You can enter ${itemName} details here, but adding ${pluralName} is not enabled in this preview.`,
    );
  };

  return (
    <>
      <FormScreenHeader fallbackHref={kind === 'deck' ? '/collections' : '/quizzes'} />
      <Text style={styles.eyebrow}>STATIC PREVIEW</Text>
      <Text style={styles.title}>{kind === 'deck' ? 'Add a deck' : 'Add a quiz'}</Text>

      <Text style={styles.description}>
        Enter a title and description. The sample list will stay unchanged.
      </Text>


      {/* para sa user input */}
      <TextField
        label={titleLabel}
        value={title}
        onChangeText={setTitle}
        placeholder={titlePlaceholder}
        autoCapitalize="words"
        maxLength={60}
        returnKeyType="next"
      />
      <TextField
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder={`What will this ${itemName} cover?`}
        multiline
        maxLength={180}
      />

      {/* para sa button */}
      <AppButton 
        title={buttonLabel} 
        onPress={showPreviewMessage} 
        style={styles.button} 
      />

      <Text style={styles.note}>Nothing is saved or added to the list.</Text>
    </>
  );
}

const styles = StyleSheet.create({//para sa Style 

  eyebrow: { 
    color: palette.muted, 
    fontSize: 10, 
    fontWeight: '700', 
    letterSpacing: 1.5, 
    marginBottom: 10 
  },

  title: { 
    color: palette.ink, 
    fontSize: 29, 
    fontWeight: '700', 
    letterSpacing: -1 
  },

  description: { color: palette.muted, 
    fontSize: 13, 
    lineHeight: 19, 
    marginTop: 7, 
    marginBottom: 25 
  },
  
  button: { 
    marginTop: 6 
  },


  note: { 
    color: palette.muted, 
    fontSize: 10, 
    textAlign: 'center', 
    marginTop: 16 
  },
});
