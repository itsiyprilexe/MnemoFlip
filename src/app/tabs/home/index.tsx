import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandHeader } from '../../../components/BrandHeader';
import { AppButton } from '../../../components/AppButton';
import { StudyCalendar } from '../../../components/StudyCalendar';
import { useDecks } from '../../../hooks/useDecks';
import { palette } from '../../../theme';

export default function HomeScreen() {
  const { decks, loading, error } = useDecks();
  
  return <SafeAreaView style={styles.safe} edges={['top']}>
    <ScrollView 
      contentContainerStyle={styles.page} 
       showsVerticalScrollIndicator={false} 
       showsHorizontalScrollIndicator={false}
    >
    
    <BrandHeader />
    
    <View style={styles.intro}>
      <Text style={styles.eyebrow}>A MINDFUL LEARNING SPACE</Text>
      <Text style={styles.headline}>A little learning,</Text>
      <Text style={styles.headlineGreen}>a lot of growth.</Text>
      <Text style={styles.description}>Your study space is ready when you are.</Text>
    </View>
    
    <StudyCalendar />

    <View style={styles.sectionHeader}>
      <View style={styles.sectionText}>
       <Text style={styles.sectionTitle}>Your collections</Text>
       <Text style={styles.note}>A few places to begin</Text>
    </View>

    <Pressable 
        accessibilityRole="button" 
        accessibilityLabel="Add a deck" 
        onPress={() => router.push('/tabs/decks/create')} 
        style={styles.add}
      >
        <Ionicons 
         name="add" 
         size={21} 
         color={palette.green} 
        />
      </Pressable>

    </View>

    {loading ? 
       <Text>Loading decks...</Text> : 

     error ? 
        <Text>
           Could not load decks: {error} 
        </Text> :
        
      decks.length === 0 ? 
        <Text style={styles.empty}>
           No decks yet. Add your first deck.
        </Text> : 
         null}

    {decks.map(deck => 
      <Pressable
       key={deck.id} 
       accessibilityRole="button" 
       accessibilityLabel={`Open ${deck.title}`} 
       onPress={() =>  router.push({ 
        pathname: '/tabs/home/deck/[id]', 
        params: { id: deck.id } })} style={styles.card}>

      <View style={styles.cardTop}> 
        
       <View style={styles.icon}>
        <Ionicons 
          name="albums-outline"
           size={20} 
           color={palette.green} 
        />
      
      </View>
          
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>
            {deck.title}
          </Text>

          <Text style={styles.note}>
            {deck.description || 'Study deck'}
          </Text>
        </View>
            
      </View>

      <View style={styles.cardBottom}>

        <Text style={styles.note}>
          {deck.itemCount}
           {deck.itemCount === 1 ? 'flashcard' : 'flashcards'}
        </Text>

        <View style={styles.open}>
          <Text style={styles.openText}>
            Open deck
          </Text>

        <Ionicons
          name="arrow-forward"
          size={17} 
          color={palette.green} 
        />
      </View>

      </View>
    
    </Pressable>)}
    
      <AppButton 
       title="Continue studying"
       onPress={() => router.navigate('/tabs/decks')} 
       style={styles.continue} 
      />

    </ScrollView>

  </SafeAreaView>;
}
const styles = StyleSheet.create({ 
  safe: {
     flex: 1,
      backgroundColor: palette.background }, 

  page: { 
    paddingHorizontal: 22,
    paddingTop: 8, 
    paddingBottom: 126 }, 

  intro: { 
    marginBottom: 14 }, 

    eyebrow: { 
      color: palette.muted, 
      fontSize: 9, 
      fontWeight: '700',
      letterSpacing: 1.5,
       marginBottom: 12 },

    headline: { 
      color: '#294638',
      fontSize: 29, 
      lineHeight: 35, fontWeight: '700', 
      letterSpacing: -0.8 }, 

    headlineGreen:  {
       color: '#315D48',
        fontSize: 29,
        lineHeight: 35, 
        fontWeight: '700',
        letterSpacing: -0.8 }, 
        
    description: { 
      color: palette.muted, 
      marginTop: 8, 
      fontSize: 12 },
      
    sectionHeader: {
       flexDirection: 'row', 
       alignItems: 'center',
        marginBottom: 15 },
        
    sectionText: { 
      flex: 1 },
      
    sectionTitle: { color: '#294638', fontSize: 18, fontWeight: '700' }, note: { color: palette.muted, fontSize: 11, marginTop: 4 }, add: { width: 38, height: 38, borderRadius: 19, backgroundColor: palette.surface, borderColor: palette.line, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }, empty: { color: palette.muted, marginBottom: 16 }, card: { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, borderRadius: 20, padding: 15, marginBottom: 12 }, cardTop: { flexDirection: 'row', alignItems: 'center' }, icon: { width: 42, height: 42, borderRadius: 13, backgroundColor: palette.greenLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 }, cardText: { flex: 1 }, cardTitle: { color: '#294638', fontSize: 16, fontWeight: '700' }, cardBottom: { borderTopWidth: 1, borderTopColor: palette.line, marginTop: 14, paddingTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, open: { flexDirection: 'row', alignItems: 'center', gap: 10 }, openText: { color: palette.green, fontSize: 11, fontWeight: '700' }, continue: { marginTop: 10 } });
